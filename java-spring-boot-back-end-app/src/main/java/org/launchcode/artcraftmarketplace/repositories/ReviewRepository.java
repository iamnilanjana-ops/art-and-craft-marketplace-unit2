package org.launchcode.artcraftmarketplace.repositories;

import org.launchcode.artcraftmarketplace.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
}