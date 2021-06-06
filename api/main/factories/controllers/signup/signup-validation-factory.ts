import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '@/presentation/helpers/validators'
import { Validation } from '@/presentation/interfaces/validation'
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter'

export const makeSignupValidation = (): ValidationComposite => {
	const validations: Validation[] = []
	for (const field of ['email','password', 'name']) {
		validations.push(new RequiredFieldValidation(field))
	}
	validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
	return new ValidationComposite(validations)
}
