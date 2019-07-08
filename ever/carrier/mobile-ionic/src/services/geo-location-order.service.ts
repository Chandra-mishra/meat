import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import Order from '@modules/server.common/entities/Order';
import { map, share } from 'rxjs/operators';
import IGeoLocation from '@modules/server.common/interfaces/IGeoLocation';

@Injectable()
export class GeoLocationOrdersService {
	constructor(private readonly apollo: Apollo) {}

	getOrderForWork(
		geoLocation: IGeoLocation,
		skippedOrderIds: string[] = [],
		options: { sort: string } = { sort: 'asc' }
	) {
		return this.apollo
			.watchQuery<{ getOrderForWork: Order }>({
				query: gql`
					query GetOrderForWork(
						$geoLocation: GeoLocationFindInput!
						$skippedOrderIds: [String!]!
						$options: GeoLocationOrdersOptions
					) {
						getOrderForWork(
							geoLocation: $geoLocation
							skippedOrderIds: $skippedOrderIds
							options: $options
						) {
							id
						}
					}
				`,
				variables: { geoLocation, skippedOrderIds, options },
				pollInterval: 2000
			})
			.valueChanges.pipe(
				map((res) => res.data.getOrderForWork),
				share()
			);
	}
}
