import { InvalidParamError } from '@/presentation/errors/invalid-param-errors'
import { Validation } from '@/presentation/interfaces/validation'
import { EmailValidator } from '@/presentation/interfaces/email-validator'

export class EmailValidation implements Validation {
	private readonly fieldName: string
	private readonly emailValidator: EmailValidator
	constructor (fieldName: string, emailValidator: EmailValidator) {
		this.fieldName = fieldName
		this.emailValidator = emailValidator
	}

	validate (input: any): Error | undefined {
		const isValid = this.emailValidator.isValid(input[this.fieldName])
		if (!isValid) {
			return new InvalidParamError(this.fieldName)
		}
	}
}
