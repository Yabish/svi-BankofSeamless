import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { throwError, retry, catchError } from 'rxjs';
import { ApiResponse } from '../model/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiURL = environment.API_ENDPOINT;

  constructor(private http: HttpClient) {}

  getBalance() {
    return this.http.get<ApiResponse>(`${this.apiURL}/api/v1/balance`);
  }

  getIBANDetails(iban: string) {
    return this.http.get<ApiResponse>(`${this.apiURL}/api/v1/bank/${iban}`);
  }

  moneyTransfer(iban: string, body: object) {
    return this.http.post<ApiResponse>(
      `${this.apiURL}/api/v1/transfer/${iban}`,
      body
    );
  }
}
