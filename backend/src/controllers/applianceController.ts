import { Request, Response, NextFunction } from 'express';
import { eq, ilike, or, and, sql, desc, asc, count } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { appliances } from '../db/schema.js';
import { 
  ApplianceWithStatus, 
  ApplianceQueryParams, 
  CreateApplianceRequest, 
  UpdateApplianceRequest,
  ApplianceStatsResponse,
  ApplianceCategory,
  WarrantyStatus
} from '../types/index.js';
import { 
  createApplianceSchema, 
  updateApplianceSchema, 
  applianceParamsSchema, 
  applianceQuerySchema 
} from '../middleware/validation.js';
import { calculateWarrantyStatus, calculateWarrantyExpiry } from '../utils/warrantyCalculator.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export class ApplianceController {
  
  // GET /api/appliances
  public getAppliances = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const query = applianceQuerySchema.parse(req.query);
    
    // Build where conditions
    const whereConditions = [];

    // Search filter
    if (query.search) {
      const searchTerm = `%${query.search.toLowerCase()}%`;
      whereConditions.push(
        or(
          ilike(appliances.name, searchTerm),
          ilike(appliances.brand, searchTerm),
          ilike(appliances.model, searchTerm)
        )
      );
    }

    // Category filter
    if (query.category) {
      whereConditions.push(eq(appliances.category, query.category));
    }

    // Build final where clause
    const whereClause = whereConditions.length === 1 
      ? whereConditions[0] 
      : whereConditions.length > 1 
        ? and(...whereConditions) 
        : undefined;

    // Determine sort column
    let sortColumn;
    switch (query.sortBy) {
      case 'name':
        sortColumn = appliances.name;
        break;
      case 'purchaseDate':
        sortColumn = appliances.purchaseDate;
        break;
      case 'warrantyExpiryDate':
        sortColumn = appliances.warrantyExpiryDate;
        break;
      case 'createdAt':
        sortColumn = appliances.createdAt;
        break;
      default:
        sortColumn = appliances.name;
    }

    // Build and execute base query
    const baseQueryBuilder = db.select().from(appliances);
    const baseQuery = whereClause 
      ? baseQueryBuilder.where(whereClause)
      : baseQueryBuilder;
    
    const sortedQuery = baseQuery.orderBy(
      query.sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn)
    );
    
    const finalQuery = sortedQuery.limit(query.limit).offset(query.offset);

    // Build and execute count query
    const countQueryBuilder = db.select({ count: count() }).from(appliances);
    const countQuery = whereClause 
      ? countQueryBuilder.where(whereClause)
      : countQueryBuilder;

    // Execute queries
    const [results, totalCountResult] = await Promise.all([
      finalQuery,
      countQuery
    ]);

    const totalCount = totalCountResult[0]?.count || 0;

    // Enhance results with warranty status
    const enhancedResults: ApplianceWithStatus[] = results.map((appliance: any) => {
      const warrantyInfo = calculateWarrantyStatus(appliance.warrantyExpiryDate);
      return {
        id: appliance.id,
        name: appliance.name,
        brand: appliance.brand || undefined,
        model: appliance.model || undefined,
        serialNumber: appliance.serialNumber || undefined,
        purchaseDate: appliance.purchaseDate.toISOString(),
        purchaseLocation: appliance.purchaseLocation || undefined,
        warrantyMonths: appliance.warrantyMonths,
        warrantyExpiryDate: appliance.warrantyExpiryDate.toISOString(),
        supportContactId: appliance.supportContactId || undefined,
        notes: appliance.notes || undefined,
        category: appliance.category || undefined,
        createdAt: appliance.createdAt.toISOString(),
        updatedAt: appliance.updatedAt.toISOString(),
        warrantyStatus: warrantyInfo.status,
        daysUntilExpiry: warrantyInfo.daysUntilExpiry
      };
    });

    // Apply status filter after warranty calculation
    let filteredResults = enhancedResults;
    if (query.status && query.status !== 'all') {
      filteredResults = enhancedResults.filter(appliance => appliance.warrantyStatus === query.status);
    }

    res.json({
      success: true,
      data: filteredResults,
      pagination: {
        total: Number(totalCount),
        limit: query.limit,
        offset: query.offset,
        hasMore: query.offset + query.limit < Number(totalCount)
      }
    });
  });

  // GET /api/appliances/stats
  public getApplianceStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const results = await db.select().from(appliances);
    
    const stats: ApplianceStatsResponse = {
      total: results.length,
      active: 0,
      expiring: 0,
      expired: 0,
      byCategory: {
        kitchen: 0,
        laundry: 0,
        'heating-cooling': 0,
        entertainment: 0,
        cleaning: 0,
        other: 0
      }
    };

    results.forEach((appliance: any) => {
      // Calculate warranty status
      const { status } = calculateWarrantyStatus(appliance.warrantyExpiryDate);
      stats[status]++;

      // Count by category
      if (appliance.category && appliance.category in stats.byCategory) {
        stats.byCategory[appliance.category as ApplianceCategory]++;
      }
    });

    res.json({
      success: true,
      data: stats
    });
  });

  // GET /api/appliances/:id
  public getApplianceById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = applianceParamsSchema.parse(req.params);
    
    const result = await db.select().from(appliances).where(eq(appliances.id, id)).limit(1);
    
    if (result.length === 0) {
      throw new AppError('Appliance not found', 404);
    }

    const appliance = result[0];
    const warrantyInfo = calculateWarrantyStatus(appliance.warrantyExpiryDate);

    const enhancedAppliance: ApplianceWithStatus = {
      id: appliance.id,
      name: appliance.name,
      brand: appliance.brand || undefined,
      model: appliance.model || undefined,
      serialNumber: appliance.serialNumber || undefined,
      purchaseDate: appliance.purchaseDate.toISOString(),
      purchaseLocation: appliance.purchaseLocation || undefined,
      warrantyMonths: appliance.warrantyMonths,
      warrantyExpiryDate: appliance.warrantyExpiryDate.toISOString(),
      supportContactId: appliance.supportContactId || undefined,
      notes: appliance.notes || undefined,
      category: appliance.category || undefined,
      createdAt: appliance.createdAt.toISOString(),
      updatedAt: appliance.updatedAt.toISOString(),
      warrantyStatus: warrantyInfo.status,
      daysUntilExpiry: warrantyInfo.daysUntilExpiry
    };

    res.json({
      success: true,
      data: enhancedAppliance
    });
  });

  // POST /api/appliances
  public createAppliance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = createApplianceSchema.parse(req.body);
    
    // Calculate warranty expiry date
    const warrantyExpiryDate = calculateWarrantyExpiry(
      validatedData.purchaseDate, 
      validatedData.warrantyMonths
    );

    const newAppliance = await db.insert(appliances)
      .values({
        name: validatedData.name,
        brand: validatedData.brand,
        model: validatedData.model,
        serialNumber: validatedData.serialNumber,
        purchaseDate: new Date(validatedData.purchaseDate),
        purchaseLocation: validatedData.purchaseLocation,
        warrantyMonths: validatedData.warrantyMonths,
        warrantyExpiryDate,
        supportContactId: validatedData.supportContactId,
        notes: validatedData.notes,
        category: validatedData.category,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    const appliance = newAppliance[0];
    const warrantyInfo = calculateWarrantyStatus(appliance.warrantyExpiryDate);

    const enhancedAppliance: ApplianceWithStatus = {
      id: appliance.id,
      name: appliance.name,
      brand: appliance.brand || undefined,
      model: appliance.model || undefined,
      serialNumber: appliance.serialNumber || undefined,
      purchaseDate: appliance.purchaseDate.toISOString(),
      purchaseLocation: appliance.purchaseLocation || undefined,
      warrantyMonths: appliance.warrantyMonths,
      warrantyExpiryDate: appliance.warrantyExpiryDate.toISOString(),
      supportContactId: appliance.supportContactId || undefined,
      notes: appliance.notes || undefined,
      category: appliance.category || undefined,
      createdAt: appliance.createdAt.toISOString(),
      updatedAt: appliance.updatedAt.toISOString(),
      warrantyStatus: warrantyInfo.status,
      daysUntilExpiry: warrantyInfo.daysUntilExpiry
    };

    res.status(201).json({
      success: true,
      data: enhancedAppliance
    });
  });

  // PUT /api/appliances/:id
  public updateAppliance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = applianceParamsSchema.parse(req.params);
    const validatedData = updateApplianceSchema.parse(req.body);

    // Check if appliance exists
    const existing = await db.select().from(appliances).where(eq(appliances.id, id)).limit(1);
    if (existing.length === 0) {
      throw new AppError('Appliance not found', 404);
    }

    // Calculate new warranty expiry date if purchase date or warranty months changed
    let warrantyExpiryDate: Date | undefined;
    if (validatedData.purchaseDate || validatedData.warrantyMonths) {
      const purchaseDate = validatedData.purchaseDate || existing[0].purchaseDate.toISOString();
      const warrantyMonths = validatedData.warrantyMonths || existing[0].warrantyMonths;
      warrantyExpiryDate = calculateWarrantyExpiry(purchaseDate, warrantyMonths);
    }

    const updateData: any = {
      ...validatedData,
      updatedAt: new Date()
    };

    if (validatedData.purchaseDate) {
      updateData.purchaseDate = new Date(validatedData.purchaseDate);
    }

    if (warrantyExpiryDate) {
      updateData.warrantyExpiryDate = warrantyExpiryDate;
    }

    const updatedAppliance = await db.update(appliances)
      .set(updateData)
      .where(eq(appliances.id, id))
      .returning();

    const appliance = updatedAppliance[0];
    const warrantyInfo = calculateWarrantyStatus(appliance.warrantyExpiryDate);

    const enhancedAppliance: ApplianceWithStatus = {
      id: appliance.id,
      name: appliance.name,
      brand: appliance.brand || undefined,
      model: appliance.model || undefined,
      serialNumber: appliance.serialNumber || undefined,
      purchaseDate: appliance.purchaseDate.toISOString(),
      purchaseLocation: appliance.purchaseLocation || undefined,
      warrantyMonths: appliance.warrantyMonths,
      warrantyExpiryDate: appliance.warrantyExpiryDate.toISOString(),
      supportContactId: appliance.supportContactId || undefined,
      notes: appliance.notes || undefined,
      category: appliance.category || undefined,
      createdAt: appliance.createdAt.toISOString(),
      updatedAt: appliance.updatedAt.toISOString(),
      warrantyStatus: warrantyInfo.status,
      daysUntilExpiry: warrantyInfo.daysUntilExpiry
    };

    res.json({
      success: true,
      data: enhancedAppliance
    });
  });

  // DELETE /api/appliances/:id
  public deleteAppliance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = applianceParamsSchema.parse(req.params);

    // Check if appliance exists
    const existing = await db.select().from(appliances).where(eq(appliances.id, id)).limit(1);
    if (existing.length === 0) {
      throw new AppError('Appliance not found', 404);
    }

    await db.delete(appliances).where(eq(appliances.id, id));

    res.json({
      success: true,
      message: 'Appliance deleted successfully'
    });
  });
}