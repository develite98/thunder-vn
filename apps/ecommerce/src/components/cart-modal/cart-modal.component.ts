import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@mixcore/ui/modal';
import { DialogRef } from '@ngneat/dialog';
import { CartStore } from '../../stores';
import { CurrencyComponent } from '../currency/currency.component';

@Component({
  selector: 'mix-cart-modal',
  imports: [CurrencyComponent],
  templateUrl: './cart-modal.component.html',
  styleUrl: './cart-modal.component.scss',
})
export class CartModalComponent {
  public cartStore = inject(CartStore);
  public ref = inject(DialogRef);
  public router = inject(Router);
  public modal = inject(ModalService);

  public isAddNew = this.ref.data?.isAddNew;

  public onRemove(itemId: string) {
    this.modal.asKForAction(
      'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      () => {
        this.cartStore.removeItem(itemId);
      },
    );
  }

  public increase(itemId: string, quantity: number) {
    this.cartStore.updateQuantity(itemId, quantity + 1);
  }

  public decrease(itemId: string, quantity: number) {
    this.cartStore.updateQuantity(itemId, quantity - 1);
  }
}
