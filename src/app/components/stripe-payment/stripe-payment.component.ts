import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { loadStripe, StripeElements, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'payment-element',
  template: `
  <div #paymentEl></div>
  <ion-button expand="block" (click)="pay()" [disabled]="loading">{{ loading ? 'Procesando...' : 'Pagar' }}</ion-button>
  `
})
export class PaymentElementComponent implements OnInit {
  @ViewChild('paymentEl', { static: true }) paymentEl!: ElementRef;
  @Input() amount!: number;
  @Input() customerId?: string;
  @Input() email?: string;

  stripe!: Stripe;
  elements!: StripeElements;
  clientSecret!: string;
  loading = false;

  async ngOnInit() {
    this.stripe = await loadStripe((window as any).STRIPE_PUBLISHABLE_KEY)!;

    const res = await fetch(`${(window as any).BACKEND_URL}/api/stripe/payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        amount: this.amount, currency: 'mxn',
        customerId: this.customerId, receipt_email: this.email
      })
    }).then(r => r.json());

    this.clientSecret = res.clientSecret;

    this.elements = this.stripe.elements({ clientSecret: this.clientSecret });
    const paymentElement = this.elements.create('payment');
    paymentElement.mount(this.paymentEl.nativeElement);
  }

  async pay() {
    this.loading = true;
    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${(window as any).FRONTEND_URL}/pago-exitoso`
      }
    });
    this.loading = false;
    if (error) alert(error.message);
  }
}
