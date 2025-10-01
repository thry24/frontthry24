import { Component, Input } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'checkout-button',
  template: `<ion-button (click)="goCheckout()" expand="block">Pagar</ion-button>`
})
export class CheckoutButtonComponent {
  @Input() priceId!: string;     
  @Input() email?: string;

  async goCheckout() {
    const stripe = await loadStripe((window as any).STRIPE_PUBLISHABLE_KEY);
    const res = await fetch(`${(window as any).BACKEND_URL}/api/stripe/checkout`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        priceId: this.priceId,
        customerEmail: this.email,
        mode: 'payment', 
      })
    }).then(r => r.json());

    if (res?.url) {
      window.location.href = res.url;
    } else if (res?.id) {
      await stripe?.redirectToCheckout({ sessionId: res.id });
    }
  }
}
