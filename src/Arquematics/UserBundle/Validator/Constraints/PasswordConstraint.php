<?php

namespace Arquematics\UserBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class PasswordConstraint extends Constraint
{
    public $message = 'profile.passwd_has_error';
    
    public function validatedBy()
    {
    	return get_class($this) . 'Validator';
    }
}