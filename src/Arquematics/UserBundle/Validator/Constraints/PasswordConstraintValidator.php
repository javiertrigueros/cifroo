<?php

namespace Arquematics\UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class PasswordConstraintValidator extends ConstraintValidator
{

	/**
	 * Validate if value is biggest than 7 characters, if is alphanumeric and has at least one number
	 * 
	 * @param  string      $value     The string to validate
	 * @param  Constraint $constraint 
	 */
	public function validate($value, Constraint $constraint)
	{
                if (strlen( $value) <= 7)
                {
                   $this->context->addViolation($constraint->message); 
                }
                else if (ctype_alpha($value) || ctype_digit($value)) 
                {
                    $this->context->addViolation($constraint->message); 
                }
                /*
                else if ( preg_match( '~[A-Z]~', $value) 
                    && preg_match( '~[a-z]~', $value) 
                    && preg_match( '~\d~', $value))
                {
                    $this->context->addViolation($constraint->message);
                }
                
                
                $isValid = true;
		$length = strlen($value);

		// Is alphanumeric?
                /*
                 * 
                if ($length < 6) {
			$isValid = false;
		}
		if (ctype_alpha($value) || ctype_digit($value)) {
			$isValid = false;
		}
		// All chars are lowercase ?
		if (preg_match('/^[a-z0-9]+$/', $value)) {
			$isValid = false;
		}

		// All chars are uppercase ?
		if (preg_match('/^[A-Z0-9]+$/', $value)) {
			$isValid = false;
		}
        

		if ($isValid === false) {
			$this->context->addViolation($constraint->message);
		}*/
	}

}