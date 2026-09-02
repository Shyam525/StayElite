package com.stayelite.exception;

public class UnauthorizedCollectionAccessException extends RuntimeException {
    public UnauthorizedCollectionAccessException(String message) {
        super(message);
    }
}
