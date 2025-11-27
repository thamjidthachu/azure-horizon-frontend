// components/api-call-component.tsx
import { useToast } from '@/components/ui/use-toast'

const ApiCallComponent = () => {
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/v1/endpoint');
      const data = await response.json();

      // Handle API response based on status
      if (response.ok) {
        // Success response - show success toast
        toast({
          title: 'Success!',
          description: data.message || 'API call completed successfully.',
          variant: 'success',
          duration: 3000
        });
      } else {
        // API error response - show error toast
        toast({
          title: 'API Error',
          description: data.error || data.message || `Request failed with status ${response.status}`,
          variant: 'destructive',
          duration: 3000
        });
      }
    } catch (error) {
      // Network/connection error - show error toast
      console.error('API call failed:', error);
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        variant: 'destructive',
        duration: 3000
      });
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Make API Call</button>
    </div>
  );
};

export default ApiCallComponent;
