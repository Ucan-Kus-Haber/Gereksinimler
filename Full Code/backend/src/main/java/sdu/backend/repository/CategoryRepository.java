package sdu.backend.repository;



import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import sdu.backend.model.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
}