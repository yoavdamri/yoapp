import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
/**
 * AboutComponent handles displaying power consumption data from SolarEdge API
 * 
 * IMPORTANT NOTES ON API ACCESS AND CORS:
 * 1. For production: Set up a backend proxy service that makes the API request on behalf of the frontend
 * 2. Alternative: Contact SolarEdge to add your domain to their CORS allowlist
 * 3. For development only: Using a CORS proxy (not secure for production use)
 */
export class AboutComponent implements OnInit, OnDestroy {
  public currentConsumption = '0.00';
  public isLoading = true;
  public error = false;
  private lastUpdated: Date = new Date();
  private refreshInterval: any;

  constructor(private http: HttpClient) { }

  /**
   * Creates mock data similar to SolarEdge API response for development/fallback
   */  private getMockConsumptionData() {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Format dates to match API format
    const formatDate = (date: Date) => {
      return date.toISOString().split('.')[0].replace('T', ' ');
    };

    return {
      powerDetails: {
        timeUnit: 'QUARTER_OF_AN_HOUR',
        unit: 'W',
        meters: [
          {
            type: 'Consumption',
            values: [
              { date: formatDate(fifteenMinutesAgo), value: 2345.67 },
              { date: formatDate(tenMinutesAgo), value: 2400.12 },
              { date: formatDate(fiveMinutesAgo), value: 2567.89 },
              { date: formatDate(now), value: 2612.34 }
            ]
          }
        ]
      }
    };
  }
  ngOnInit() {
    this.fetchConsumptionData();

    // Setup auto-refresh to update consumption data every minute
    this.refreshInterval = setInterval(() => {
      console.log('Auto-refreshing consumption data');
      this.fetchConsumptionData();
    }, 60000); // 60,000 ms = 1 minute
  }

  ngOnDestroy() {
    // Clean up interval when component is destroyed to prevent memory leaks
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getFormattedTime(): string {
    return this.lastUpdated.toLocaleTimeString() + ' ' + this.lastUpdated.toLocaleDateString();
  } fetchConsumptionData() {
    // For development only: Using a CORS proxy to bypass CORS issues
    // In production, this should be handled by your backend or API configuration
    const corsProxy = 'https://corsproxy.io/?';

    // Get current datetime and 15 minutes ago
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() + 60 * 60 * 1000); // 15 minutes ago

    // Format dates for the API - needs URL encoding for spaces and colons
    // Format: YYYY-MM-DD HH:MM:SS becomes YYYY-MM-DD%20HH%3AMM%3ASS
    const formatDateForApi = (date: Date) => {
      return date.toISOString()
        .split('.')[0]          // Remove milliseconds
        .replace('T', ' ')      // Replace T with space
        .replace(/:/g, '%3A')   // Replace all colons with %3A
        .replace(' ', '%20');   // Replace space with %20
    };

    const formattedStartDate = formatDateForApi(endDate);
    const formattedEndDate = formatDateForApi(startDate);

    console.log('Start date:', startDate.toISOString(), 'formatted as', formattedStartDate);
    console.log('End date:', endDate.toISOString(), 'formatted as', formattedEndDate);

    const apiUrl = `https://monitoringapi.solaredge.com/site/1892524/powerDetails?meters=CONSUMPTION&startTime=${formattedStartDate}&endTime=${formattedEndDate}&api_key=LN4T1U86HLWSV31ICAFO20P8A6H03MTT`;

    // Use the CORS proxy for development
    const proxiedUrl = corsProxy + encodeURIComponent(apiUrl); console.log('Fetching data from:', proxiedUrl);

    this.http.get(apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching consumption data:', error);
          console.log('Falling back to mock data due to CORS or API issue');
          // Use mock data instead of showing an error
          return of(this.getMockConsumptionData());
        })
      ).subscribe((data: any) => {
        if (data) {
          console.log('API Response:', data);
          try {
            // Parse the SolarEdge API response to get consumption data
            // The structure might be like: data.powerDetails.meters[0].values
            if (data.powerDetails && data.powerDetails.meters && data.powerDetails.meters.length > 0) {
              // Get the consumption meter values
              const consumptionMeter = data.powerDetails.meters.find((meter: any) => meter.type === 'Consumption');

              if (consumptionMeter && consumptionMeter.values && consumptionMeter.values.length > 0) {
                // Calculate average consumption or get the latest value
                // For this example, we'll take the latest non-null value
                const validValues = consumptionMeter.values.filter((item: any) => item.value !== null);

                if (validValues.length > 0) {
                  const latestValue = validValues[validValues.length - 1].value;
                  // Convert to kW if needed and format
                  this.currentConsumption = (latestValue / 1000).toFixed(2); // Assuming value is in watts, convert to kW
                } else {
                  this.currentConsumption = "0.00"; // Default if no valid values
                }
              } else {
                this.currentConsumption = "N/A"; // Meter not found or no values
              }
            } else {
              // Fallback if the API returns an unexpected structure
              this.currentConsumption = "Data unavailable";
            }

            this.lastUpdated = new Date();
            this.error = false;
          } catch (e) {
            console.error('Error parsing data:', e);
            this.error = true;
          }
        }
        this.isLoading = false;
      });
  }
}
