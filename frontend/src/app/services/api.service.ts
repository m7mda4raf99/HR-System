import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.baseUrl; // Replace with your Django server API base URL

  constructor(private httpClient: HttpClient) { }

  private async SyncClient(url: string, method: string, params: any = null, body: any = null, headers: any = {}): Promise<any> {

    let paramsData: any = undefined
    let bodyData: any = undefined

    paramsData = {
      params: undefined,
      headers: new HttpHeaders()
    }

    if (params && params !== null) {
      paramsData.params = params
    }

    if (body && body !== null) {
      bodyData = {
        body
      }
    }

    if (Object.keys(headers).length > 0) {
      for (const key in headers) {
        paramsData.headers.append(key, headers[key])
      }
    }

    return new Promise((resolve) => {
      if (method === 'GET') {
        this.httpClient.get(url, paramsData !== undefined ? paramsData : null).subscribe({
          next: (data: any) => {
            resolve(data);
          },
          error: () => { resolve(false) }
        })
      }
      if (method === 'POST') {
        this.httpClient.post(url, body !== undefined ? body : null).subscribe({
          next: (data: any) => {
            resolve(data);
          },
          error: () => { resolve(false) }
        })

      }

      if (method === 'PUT') {
        this.httpClient.put(url, body !== undefined ? body : null, paramsData !== undefined ? paramsData : null).subscribe({
          next: (data: any) => {
            resolve(data);
          },
          error: () => { resolve(false) }
        })

      }
    })
  }

  public async login(data: any): Promise<any> {
    return await this.SyncClient(`${this.baseUrl}login`, 'POST', null, data)
  }

  public async getEmployees(): Promise<any> {
    return await this.SyncClient(`${this.baseUrl}get-employees`, 'GET');
  }

  public async addEmployee(data: any): Promise<any> {
    return await this.SyncClient(`${this.baseUrl}add-employee`, 'POST', null, data);
  }

  public async editEmployee(id: number, data: any): Promise<any> {
    return await this.SyncClient(`${this.baseUrl}edit-employee/${id}`, 'PUT', null, data);
  }

  public async getEmployeeAttendances(id: number): Promise<any> {
    return await this.SyncClient(`${this.baseUrl}get-employee-attendances/${id}`, 'GET');
  }

  public async addAttendance(data: any): Promise<any> {
    return await this.SyncClient(`${this.baseUrl}add-attendance`, 'POST', null, data);
  }
}
