import { formatJSONResponse } from '@/libs/apiGateway'
import { HttpRequest, HttpResponse } from '@/presentation/interfaces/http'

export const lambdaAdapt = (controller: any) => {
	return async (data: any) => {
		const httpRequest: HttpRequest = {
			body: data
		}
		const httpResponse: HttpResponse = await controller.handle(httpRequest)
		return formatJSONResponse(httpResponse)
	}
}
