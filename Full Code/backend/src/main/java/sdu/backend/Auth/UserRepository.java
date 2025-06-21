package sdu.backend.Auth;

import org.springframework.data.mongodb.repository.MongoRepository;
import sdu.backend.Auth.user.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}