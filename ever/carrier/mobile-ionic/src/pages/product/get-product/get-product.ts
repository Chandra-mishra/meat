import { Component } from '@angular/core';
import ICarrier from '@modules/server.common/interfaces/ICarrier';
import IOrder from '@modules/server.common/interfaces/IOrder';
import { OrderRouter } from '@modules/client.common.angular2/routers/order-router.service';
import { CarrierRouter } from '@modules/client.common.angular2/routers/carrier-router.service';
import OrderCarrierStatus from '@modules/server.common/enums/OrderCarrierStatus';
import { CarrierOrdersRouter } from '@modules/client.common.angular2/routers/carrier-orders-router.service';
import { ILocaleMember } from '@modules/server.common/interfaces/ILocale';
import { ProductLocalesService } from '@modules/client.common.angular2/locale/product-locales.service';
import { Store } from '../../../services/store.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
	selector: 'page-get-product',
	templateUrl: 'get-product.html'
})
export class GetProductPage {
	carrier: ICarrier;
	selectedOrder: IOrder;
	disabledButtons: boolean = true;

	constructor(
		private orderRouter: OrderRouter,
		private carrierRouter: CarrierRouter,
		private carrierOrdersRouter: CarrierOrdersRouter,
		private _translateProductLocales: ProductLocalesService,
		private store: Store,
		private router: Router
	) {}

	ionViewWillEnter() {
		this.loadData();
	}

	async gotProduct() {
		this.disabledButtons = true;
		if (this.carrier && this.selectedOrder) {
			await this.carrierOrdersRouter.updateStatus(
				this.carrier['id'],
				OrderCarrierStatus.CarrierPickedUpOrder
			);

			this.router.navigateByUrl('/main/starting-delivery', {
				skipLocationChange: false
			});
		} else {
			// TODO: replace with popup
			alert('Try again!');
		}
		this.disabledButtons = false;
	}

	async cancelWork() {
		this.disabledButtons = true;
		if (this.carrier && this.selectedOrder) {
			await this.carrierOrdersRouter.cancelDelivery(this.carrier['id'], [
				this.selectedOrder['id']
			]);
			localStorage.removeItem('orderId');

			this.router.navigateByUrl('/main/home', {
				skipLocationChange: false
			});
		} else {
			// 	// TODO: replace with popup
			alert('Try again!');
		}
		this.disabledButtons = false;
	}

	localeTranslate(member: ILocaleMember[]): string {
		return this._translateProductLocales.getTranslate(member);
	}

	private async loadData() {
		this.carrier = await this.carrierRouter
			.get(this.store.carrierId)
			.pipe(first())
			.toPromise();

		this.selectedOrder = await this.orderRouter
			.get(this.store.orderId, {
				populateWarehouse: true
			})
			.pipe(first())
			.toPromise();

		this.disabledButtons = false;
	}
}
