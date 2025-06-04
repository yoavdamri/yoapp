import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit() {
    // Get current date and subtract 12 minutes using native JavaScript
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 12 * 60 * 1000); // 12 minutes ago

    // Format dates for the API (YYYY-MM-DD HH:mm:ss)
    const formatDate = (date: Date): string => {
      return date.toISOString()
        .split('.')[0]      // Remove milliseconds
        .replace('T', ' ');  // Replace T with space
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const myURL = `https://monitoringapi.solaredge.com/site/1892524/powerDetails?meters=CONSUMPTION&startTime=${formattedStartDate}&endTime=${formattedEndDate}&api_key=LN4T1U86HLWSV31ICAFO20P8A6H03MTT`;
    // const myURL = 'https://monitoringapi.solaredge.com/site/1892524/powerDetails?meters=CONSUMPTION&startTime=2025-05-27%2015%3A06%3A38&endTime=2025-05-27%2015%3A21%3A38&api_key=LN4T1U86HLWSV31ICAFO20P8A6H03MTT';

    // Make JSONP call
    console.log('Making JSONP call to:', myURL);

    this.http.jsonp(myURL, 'callback').subscribe({
      next: (result: any) => {
        console.log('JSONP call successful:', result);
        const consValues = result['powerDetails'].meters[0].values;
        let latestValue = 0;
        if (consValues.length > 1) {
          latestValue = consValues[consValues.length - 1].value;
          if (latestValue > 0) {
            // Convert to kW if needed
            console.log('Latest consumption:', (latestValue / 1000).toFixed(2), 'kW');
          }
          else {
            latestValue = consValues[0].value;
            console.log('Latest consumption:', (latestValue / 1000).toFixed(2), 'kW');
          }
        }
        console.log('start');
        Notification.requestPermission().then((result) => {
          console.log('end');
          if (result === 'granted') {
            console.log('Notification permission granted');
            new Notification('SolarEdge API Consumption' + latestValue);
          }
        });
      },
      error: (error) => {
        console.error('JSONP call failed:', error);
        console.log('Note: SolarEdge API may not support JSONP. Consider using regular HTTP with CORS proxy instead.');
      }
    });
  }

}
