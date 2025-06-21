package sdu.backend.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data // Generates getters, setters, toString, equals, and hashCode
@Builder // Enables builder pattern for creating objects
@NoArgsConstructor // Generates no-args constructor
@AllArgsConstructor // Generates all-args constructor
@Document(collection = "categories") // Maps this class to the "categories" collection in MongoDB
public class Category {

    @Id
    private String id; // Unique identifier for the category

    private String name; // Name of the category

    private String description; // Optional description for the category

    @Builder.Default
    private List<Category> subcategories = new ArrayList<>(); // List of subcategories (embedded documents)

    // Helper method to add a subcategory
    public void addSubcategory(Category subcategory) {
        this.subcategories.add(subcategory);
    }

    // Helper method to remove a subcategory
    public void removeSubcategory(Category subcategory) {
        this.subcategories.remove(subcategory);
    }
}