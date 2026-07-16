package org.lifelink.util;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicLong;

@Service
public class MongoIdGeneratorService {

    private final AtomicLong sequence = new AtomicLong(System.currentTimeMillis());

    public Long nextId() {
        return sequence.incrementAndGet();
    }
}