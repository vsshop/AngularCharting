import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        min: 0
      }
    }
  };
  chartLabels: string[] = ['Real time data for the chart'];
  chartLegend: boolean = true;


  public bradcastedData: ChartModel[] = [];
  public data: ChartModel[] = [];
  private hubConnection: signalR.HubConnection | null = null;

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.startConnection();
    this.addTransferChartDataListener();
    this.startHttpRequest();
    this.addBroadcastChartDataListener();
  }


  public startConnection()
  {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chart')
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener()
  {
    this.hubConnection?.on('transferchartdata', (data) => {
      this.data = data;
      console.log(data);
    });
  }

  private startHttpRequest()
  {
    this.http.get('https://localhost:5001/api/chart')
      .subscribe(res => {
        console.log(res);
      })
  }


  public broadcastChartData()
  {
    const data = this.data.map(m => {
      const temp = {
        data: m.data,
        label: m.label
      }
      return temp;
    });
    this.hubConnection?.invoke('broadcastchartdata', data)
      .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener(){
    this.hubConnection?.on('broadcastchartdata', (data) => {
      this.bradcastedData = data;
    })
  }

  public chartClicked(event: any)
  {
    this.broadcastChartData();
  }
}

export interface ChartModel {
  data: [],
  label: string
  backgroundColor: string
}
