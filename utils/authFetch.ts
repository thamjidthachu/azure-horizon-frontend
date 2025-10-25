export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const access = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const headers = {
    ...(init.headers || {}),
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 authFetch called:', {
      url: input,
      method: init.method || 'GET',
      hasToken: !!access,
      headers: Object.keys(headers)
    })
  }
  
  try {
    const response = await fetch(input, { ...init, headers })
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📡 authFetch response:', {
        url: input,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })
    }
    
    return response
  } catch (error) {
    console.error('❌ authFetch error:', error)
    throw error
  }
}