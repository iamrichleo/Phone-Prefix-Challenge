import fetchRequest from './fetchRequest';

export default async function fetchDeviceLocation(): Promise<string | undefined> {
  try {
    const cloudFlareTrace = 'https://www.cloudflare.com/cdn-cgi/trace';

    // Use fetchRequest with responseType as 'text'
    const responseText = await fetchRequest<string>(cloudFlareTrace, {
      responseType: 'text',
    });

    const lines = responseText.match(/[^\r\n]+/g);
    if (!lines) return;

    const locationLine = lines.find((line: string) => line.startsWith('loc'));
    return locationLine ? locationLine.split('=')[1] : undefined;
  } catch (error) {
    console.error('Error fetching device location:', error);
    return undefined; // Returning undefined to align with the original return type
  }
}
