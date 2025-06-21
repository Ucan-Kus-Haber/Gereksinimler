package sdu.backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sdu.backend.model.Category;
import sdu.backend.repository.CategoryRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Save a category
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get a category by ID
    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
    }

    // Update a category by ID
    public Category updateCategory(String id, Category updatedCategory) {
        Category existingCategory = getCategoryById(id);
        existingCategory.setName(updatedCategory.getName());
        existingCategory.setDescription(updatedCategory.getDescription());
        existingCategory.setSubcategories(updatedCategory.getSubcategories());
        return categoryRepository.save(existingCategory);
    }

    // Delete a category by ID
    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }

    // Add a subcategory to a category
    public Category addSubcategoryToCategory(String categoryId, Category subcategory) {
        Category category = getCategoryById(categoryId);
        category.addSubcategory(subcategory);
        return categoryRepository.save(category);
    }

    // Remove a subcategory from a category
    public Category removeSubcategoryFromCategory(String categoryId, String subcategoryId) {
        Category category = getCategoryById(categoryId);
        category.getSubcategories().removeIf(sub -> sub.getId().equals(subcategoryId));
        return categoryRepository.save(category);
    }
}