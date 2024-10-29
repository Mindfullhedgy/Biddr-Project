import { format } from 'date-fns';
import { SAM_API } from './endpoints';

interface SearchParams {
  postedFrom?: Date;
  postedTo?: Date;
  deadlineFrom?: Date;
  deadlineTo?: Date;
  limit?: number;
  offset?: number;
}

export interface SamOpportunity {
  title: string;
  postedDate: string;
  responseDeadLine: string;
  description: string;
  type: string;
  solicitationNumber: string;
}

export interface SamApiResponse {
  totalRecords: number;
  opportunitiesData: SamOpportunity[];
}

export async function searchOpportunities({
  postedFrom,
  postedTo,
  deadlineFrom,
  deadlineTo,
  limit = 10,
  offset = 0,
}: SearchParams): Promise<SamApiResponse> {
  const apiKey = process.env.NEXT_PUBLIC_SAM_API_KEY;
  
  if (!apiKey) {
    throw new Error('SAM API key is not configured. Please add NEXT_PUBLIC_SAM_API_KEY to your environment variables.');
  }

  const formatDate = (date?: Date): string => {
    if (!date) return '';
    try {
      return format(date, 'MM/dd/yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const params = new URLSearchParams({
    api_key: apiKey,
    limit: limit.toString(),
    offset: offset.toString(),
    ptype: 'o,s,k',
    deptname: 'general',
    format: 'json'
  });

  // Add date parameters only if they exist
  const postedFromStr = formatDate(postedFrom);
  const postedToStr = formatDate(postedTo);
  const deadlineFromStr = formatDate(deadlineFrom);
  const deadlineToStr = formatDate(deadlineTo);

  if (postedFromStr) params.append('postedFrom', postedFromStr);
  if (postedToStr) params.append('postedTo', postedToStr);
  if (deadlineFromStr) params.append('rdlfrom', deadlineFromStr);
  if (deadlineToStr) params.append('rdlto', deadlineToStr);

  const url = `${SAM_API.BASE_URL}${SAM_API.SEARCH}`;
  
  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.errorMessage || 
        `SAM API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from SAM API');
    }

    // Log API response details (for development)
    if (process.env.NODE_ENV === 'development') {
      console.log('SAM API Response:', {
        totalRecords: data.totalRecords,
        recordCount: data.opportunitiesData?.length || 0
      });

      if (data.opportunitiesData?.length > 0) {
        console.log('Sample Opportunity:', {
          title: data.opportunitiesData[0].title,
          postedDate: data.opportunitiesData[0].postedDate,
          type: data.opportunitiesData[0].type
        });
      }
    }

    return {
      totalRecords: data.totalRecords || 0,
      opportunitiesData: Array.isArray(data.opportunitiesData) ? data.opportunitiesData : []
    };
  } catch (error) {
    console.error('SAM API Error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to fetch opportunities from SAM API');
  }
}