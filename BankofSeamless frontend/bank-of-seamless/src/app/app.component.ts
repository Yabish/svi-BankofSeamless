import { Component } from '@angular/core';
import { countryIbanLookup } from './model/country-iban.model';
import { ApiService } from './services/api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  avalableBalance: number = 0;
  currency: string = '';
  iban: string = '';
  ibanLength: number = 2;
  ibancc: string = '';
  isShowFlag: boolean = false;
  isShowIbanMessage: boolean = false;
  ibanMessage: string = '';
  inputIcon: string = '';
  ibanImageUrl: string = '';
  isShowBankLogo: boolean = false;
  isShowCurrency: boolean = false;
  amount: number = 1;
  amountPercent: number = 0;
  alertMessage: string = '';

  isShowSuccessAlert: boolean = false;
  isShowDismissAlert: boolean = false;

  constructor(private apiService: ApiService) {
    apiService.getBalance().subscribe((res: any) => {
      if (res.code === 200) {
        this.avalableBalance = res.data.balance;
        this.amountPercent = (this.amount / this.avalableBalance) * 100;
      }
    });
  }

  onIbanChange(event: any) {
    this.iban = this.iban.toUpperCase();

    if (this.iban.length < 2) {
      this.isShowFlag = false;
      this.isShowIbanMessage = false;
      this.isShowBankLogo = false;
      this.isShowCurrency = false;
      this.currency = '';
      this.ibanMessage = '';
      this.inputIcon = '';
      this.ibanImageUrl = '';
      this.ibanLength = 2;
      return;
    } else if (this.iban.length === 2) {
      if (countryIbanLookup.hasOwnProperty(this.iban)) {
        this.ibanLength = countryIbanLookup[this.iban][1];
        this.ibancc = this.iban.toLocaleLowerCase();
        this.isShowFlag = true;
        this.isShowIbanMessage = false;
        this.isShowBankLogo = false;
        this.isShowCurrency = false;
        this.currency = '';
        this.ibanMessage = '';
        this.ibanImageUrl = '';
        this.inputIcon = 'question';

        // TODO: IBAN Print format
      } else {
        this.isShowFlag = false;
        this.isShowIbanMessage = true;
        this.isShowBankLogo = false;
        this.isShowCurrency = false;
        this.currency = '';
        this.ibanMessage = 'INVALID IBAN';
        this.ibanImageUrl = '';
        this.inputIcon = 'failure';
      }
    } else if (this.iban.length > 2) {
      if (this.iban.length === this.ibanLength) {
        console.log(this.iban);
        this.apiService.getIBANDetails(this.iban).subscribe((res: any) => {
          if (res.code === 203) {
            this.isShowFlag = true;
            this.isShowIbanMessage = true;
            this.ibanMessage = res.data.bank;
            this.ibanImageUrl = res.data.logo;
            this.isShowBankLogo = true;
            this.inputIcon = 'success';
            this.currency = countryIbanLookup[this.ibancc.toUpperCase()][0];
            this.isShowCurrency = true;
          } else {
            this.isShowFlag = true;
            this.isShowIbanMessage = true;
            this.isShowBankLogo = false;
            this.isShowCurrency = false;
            this.inputIcon = 'failure';
            this.ibanMessage = 'INVALID IBAN';
            this.currency = '';
          }
        });
      }
    }
  }

  onAmountChange() {
    if (this.amount > this.avalableBalance) this.amount = this.avalableBalance;
    this.amountPercent = (this.amount / this.avalableBalance) * 100;
  }

  reset() {
    this.iban = '';
    this.isShowFlag = false;
    this.isShowIbanMessage = false;
    this.isShowBankLogo = false;
    this.isShowCurrency = false;
    this.currency = '';
    this.ibanMessage = '';
    this.ibanImageUrl = '';
    this.inputIcon = '';
    this.amount = 1;
    this.amountPercent = 0;
  }

  transfer() {
    if (this.amount <= this.avalableBalance) {
      const body = {
        amount: this.amount,
        currency: this.currency,
      };
      this.apiService.moneyTransfer(this.iban, body).subscribe((res: any) => {
        if (res.code === 202) {
          this.avalableBalance = res.data.balance;
          this.isShowSuccessAlert = true;
          this.resetAlert('success');
        } else {
          this.alertMessage = res.error.message;
          this.isShowDismissAlert = true;
          this.resetAlert('dismiss');
        }
        this.reset();
      });
    } else {
    }
  }

  resetAlert(type: string) {
    if (type === 'success') {
      setTimeout(() => {
        this.isShowSuccessAlert = false;
      }, 3000);
    }
    if (type === 'dismiss') {
      setTimeout(() => {
        this.isShowDismissAlert = false;
      }, 3000);
    }
  }
}
