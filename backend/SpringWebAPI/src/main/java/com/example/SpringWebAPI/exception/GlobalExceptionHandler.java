package com.example.SpringWebAPI.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.SpringWebAPI.response.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleProductError(ProductNotFoundException exp){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserError(UserNotFoundException exp){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationError(AuthenticationException exp){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedError(AccessDeniedException exp){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErrorResponse(ex.getMessage())
        );
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public  ResponseEntity<ErrorResponse> handleUsernameAlreadyExists(UsernameAlreadyExistsException exp){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }


    @ExceptionHandler(MerchantRequestNotFoundException.class)
    public  ResponseEntity<ErrorResponse> handleUsernameAlreadyExists(MerchantRequestNotFoundException exp){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(ReviewAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleReviewAlreadyExistsException(ReviewAlreadyExistsException exp){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(MerchantProfileNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleMerchantProfileNotFoundException(MerchantProfileNotFoundException exp){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(MerchantNotAuthorizedException.class)
    public ResponseEntity<ErrorResponse> handleMerchantNotAuthorizedException(MerchantNotAuthorizedException exp){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(InvalidMerchantException.class)
    public ResponseEntity<ErrorResponse> handleInvalidMerchantException(InvalidMerchantException exp){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(ReviewNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleReviewNotFoundException(ReviewNotFoundException exp){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }


    @ExceptionHandler(UnAuthorizedException.class)
    public ResponseEntity<ErrorResponse> hanndleUnAuthorizedException(UnAuthorizedException exp){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(InvalidReviewRequestException.class)
    public ResponseEntity<ErrorResponse> handleInvalidReviewRequestException(InvalidReviewRequestException exp){
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(InvalidProductRequestException.class)
    public ResponseEntity<ErrorResponse> handleInvalidProductRequestException(InvalidProductRequestException exp){
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(
                new ErrorResponse(
                        exp.getMessage()
                )
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleInternalError(Exception exp){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ErrorResponse(
                        "An internal server error occurred. Please contact support."
                )
        );
    }

}
