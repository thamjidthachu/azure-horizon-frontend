import { useToast } from "@/components/ui/use-toast"
import { authFetch } from "./authFetch"

interface ApiResponse {
  message?: string
  error?: string
  [key: string]: any
}

interface ApiResponseHandlerOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  customSuccessMessage?: string
  customErrorMessage?: string
}

/**
 * Centralized API response handler that shows messages/errors in toasts
 */
export function handleApiResponse<T extends ApiResponse>(
  response: T,
  options: ApiResponseHandlerOptions = {}
): T {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    customSuccessMessage,
    customErrorMessage
  } = options

  // Show success message if present
  if (showSuccessToast && response.message) {
    // We'll need to get the toast function from the component context
    // This will be handled by the hook wrapper
  }

  // Show error message if present
  if (showErrorToast && response.error) {
    // We'll need to get the toast function from the component context
    // This will be handled by the hook wrapper
  }

  return response
}

/**
 * Hook that provides API response handling with toast notifications
 */
export function useApiResponseHandler() {
  const { toast } = useToast()

  const handleResponse = <T extends ApiResponse>(
    response: T,
    options: ApiResponseHandlerOptions = {}
  ): T => {
    const {
      showSuccessToast = true,
      showErrorToast = true,
      customSuccessMessage,
      customErrorMessage
    } = options

    // Show success message if present
    if (showSuccessToast && response.message) {
      toast({
        title: "Success",
        description: customSuccessMessage || response.message,
        variant: "success"
      })
    }

    // Show error message if present
    if (showErrorToast && response.error) {
      toast({
        title: "Error",
        description: customErrorMessage || response.error,
        variant: "destructive"
      })
    }

    return response
  }

  const handleError = (error: any, customMessage?: string) => {
    console.error('API Error:', error)

    // Try to extract error message from response
    let errorMessage = customMessage || "An unexpected error occurred"

    if (error?.response?.data?.error) {
      errorMessage = error.response.data.error
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    }

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive"
    })
  }

  return {
    handleResponse,
    handleError
  }
}

/**
 * Enhanced authFetch that automatically handles response messages
 */
export async function authFetchWithToast(
  input: RequestInfo,
  init: RequestInit = {},
  options: ApiResponseHandlerOptions = {}
): Promise<Response> {
  const response = await authFetch(input, init)

  // If response is not ok, try to show error message
  if (!response.ok) {
    try {
      const errorData = await response.clone().json()
      if (errorData.error || errorData.message) {
        // We'll need to handle this in the calling component
        // since we don't have access to toast here
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }
  }

  return response
}