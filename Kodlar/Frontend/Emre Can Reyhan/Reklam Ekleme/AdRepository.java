package sdu.backend.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import sdu.backend.model.Ad;

public interface AdRepository extends MongoRepository<Ad, String> {
}