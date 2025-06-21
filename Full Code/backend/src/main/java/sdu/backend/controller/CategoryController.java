package sdu.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sdu.backend.model.Category;
import sdu.backend.service.CategoryService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:5173",
        "https://frontend2.azatvepakulyyev.workers.dev","http://localhost:5174"})
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Create a new category (with improved error handling)
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            // Basic validation
            if (category == null) {
                return ResponseEntity
                        .badRequest()
                        .body(createErrorResponse("Category object cannot be null"));
            }

            if (category.getName() == null || category.getName().trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body(createErrorResponse("Category name cannot be empty"));
            }

            // Save the category
            Category savedCategory = categoryService.saveCategory(category);
            return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log the error (you should implement proper logging)
            System.err.println("Error creating category: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to create category: " + e.getMessage()));
        }
    }

    // Helper method to create consistent error responses
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        return errorResponse;
    }

    // Get all categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // Remaining methods (unchanged)
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable String id, @RequestBody Category updatedCategory) {
        Category category = categoryService.updateCategory(id, updatedCategory);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{categoryId}/subcategories")
    public ResponseEntity<Category> addSubcategory(
            @PathVariable String categoryId,
            @RequestBody Category subcategory) {
        Category updatedCategory = categoryService.addSubcategoryToCategory(categoryId, subcategory);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{categoryId}/subcategories/{subcategoryId}")
    public ResponseEntity<Category> removeSubcategory(
            @PathVariable String categoryId,
            @PathVariable String subcategoryId) {
        Category updatedCategory = categoryService.removeSubcategoryFromCategory(categoryId, subcategoryId);
        return ResponseEntity.ok(updatedCategory);
    }
}