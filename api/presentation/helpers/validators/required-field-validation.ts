import { MissingParamError } from '@/presentation/errors/missing-param-errors'
import { Validation } from '@/presentation/interfaces/validation'

export class RequiredFieldValidation implements Validation {
	private readonly fieldName: string
	constructor (fieldName: string) {
		this.fieldName = fieldName
	}

	validate (input: any): Error | undefined {
		if (!input[this.fieldName]) {
			return new MissingParamError(this.fieldName)
		}
	}
}
