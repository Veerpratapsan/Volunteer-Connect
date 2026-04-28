import { toast } from 'sonner';

export const getCurrentAddress = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      resolve(null);
      return;
    }

    const toastId = toast.loading('Fetching your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
              }
            }
          );
          
          if (!response.ok) throw new Error('Failed to fetch address');
          
          const data = await response.json();
          
          const formattedAddress = data.display_name || `${latitude}, ${longitude}`;
          
          toast.success('Location fetched successfully', { id: toastId });
          resolve(formattedAddress);
        } catch (error) {
          console.error(error);
          toast.error('Failed to resolve address from coordinates', { id: toastId });
          resolve(null);
        }
      },
      (error) => {
        console.error('Geolocation Error:', error);
        let errorMessage = 'Failed to get your location.';
        if (error.code === 1) errorMessage = 'Location access denied. Please allow it in browser/OS settings.';
        if (error.code === 2) errorMessage = 'Location information is unavailable right now.';
        if (error.code === 3) errorMessage = 'Location request timed out. Try again.';
        
        toast.error(errorMessage, { id: toastId });
        resolve(null);
      },
      { timeout: 15000, maximumAge: 0, enableHighAccuracy: true }
    );
  });
};
