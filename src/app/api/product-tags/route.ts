import { NextRequest, NextResponse } from 'next/server';
import { baseUrl } from '@/utils/config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    // Product tags endpoint - trying different possible paths
    const possiblePaths = [
      `/api/product-tags`,
      `/product-tags`,
      `/tags`,
    ];
    
    const cookieHeader = request.headers.get('cookie') || '';
    let lastError: Error | null = null;
    
    // Try each possible endpoint path
    for (const path of possiblePaths) {
      try {
        const url = `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const nextResponse = NextResponse.json(data);
          
          // Forward set-cookie headers from backend
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
              nextResponse.headers.append(key, value);
            }
          });
          
          return nextResponse;
        }
      } catch (err) {
        lastError = err as Error;
        continue;
      }
    }
    
    // If all paths failed, return empty tags array (graceful degradation)
    console.warn('Product tags endpoint not found, returning empty array');
    return NextResponse.json({ tags: [] });
  } catch (error) {
    console.error('Error fetching product tags:', error);
    // Return empty array instead of error to prevent page breakage
    return NextResponse.json({ tags: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Product tags endpoint - assuming it's /api/product-tags on backend
    const url = `${baseUrl}/api/product-tags`;

    const cookieHeader = request.headers.get('cookie') || '';
    const csrfToken = request.headers.get('X-CSRF-Token') || '';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create product tag' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const nextResponse = NextResponse.json(data);
    
    // Forward set-cookie headers from backend
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        nextResponse.headers.append(key, value);
      }
    });
    
    return nextResponse;
  } catch (error) {
    console.error('Error creating product tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // Product tags endpoint - assuming it's /api/product-tags on backend
    const url = `${baseUrl}/api/product-tags`;

    const cookieHeader = request.headers.get('cookie') || '';
    const csrfToken = request.headers.get('X-CSRF-Token') || '';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update product tag' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const nextResponse = NextResponse.json(data);
    
    // Forward set-cookie headers from backend
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        nextResponse.headers.append(key, value);
      }
    });
    
    return nextResponse;
  } catch (error) {
    console.error('Error updating product tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    // Product tags endpoint - assuming it's /api/product-tags on backend
    const url = `${baseUrl}/api/product-tags`;

    const cookieHeader = request.headers.get('cookie') || '';
    const csrfToken = request.headers.get('X-CSRF-Token') || '';
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to delete product tag' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const nextResponse = NextResponse.json(data);
    
    // Forward set-cookie headers from backend
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        nextResponse.headers.append(key, value);
      }
    });
    
    return nextResponse;
  } catch (error) {
    console.error('Error deleting product tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

