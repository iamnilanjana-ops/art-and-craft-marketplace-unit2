package org.launchcode.artcraftmarketplace.controllers;

import org.launchcode.artcraftmarketplace.models.Review;
import org.launchcode.artcraftmarketplace.repositories.ReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @PostMapping
    public Review addReview(@RequestBody Review review) {

        if (!"buyer".equalsIgnoreCase(review.getReviewerRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only buyers can write reviews."
            );
        }

        return reviewRepository.save(review);
    }

    @PutMapping("/{id}")
    public Review updateReview(
            @PathVariable int id,
            @RequestBody Review updatedReview) {

        Review existingReview = reviewRepository
                .findById(id)
                .orElseThrow();

        boolean sameEmail =
                existingReview.getReviewerEmail() != null &&
                        existingReview.getReviewerEmail()
                                .equalsIgnoreCase(updatedReview.getReviewerEmail());

        boolean sameRole =
                existingReview.getReviewerRole() != null &&
                        existingReview.getReviewerRole()
                                .equalsIgnoreCase(updatedReview.getReviewerRole());

        if (!sameEmail || !sameRole) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only edit your own review."
            );
        }

        existingReview.setRating(updatedReview.getRating());
        existingReview.setComment(updatedReview.getComment());

        return reviewRepository.save(existingReview);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(
            @PathVariable int id,
            @RequestParam String reviewerEmail,
            @RequestParam String reviewerRole) {

        Review review = reviewRepository
                .findById(id)
                .orElseThrow();

        boolean sameEmail =
                review.getReviewerEmail() != null &&
                        review.getReviewerEmail()
                                .equalsIgnoreCase(reviewerEmail);

        boolean sameRole =
                review.getReviewerRole() != null &&
                        review.getReviewerRole()
                                .equalsIgnoreCase(reviewerRole);

        if (!sameEmail || !sameRole) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only delete your own review."
            );
        }

        reviewRepository.delete(review);
    }
}