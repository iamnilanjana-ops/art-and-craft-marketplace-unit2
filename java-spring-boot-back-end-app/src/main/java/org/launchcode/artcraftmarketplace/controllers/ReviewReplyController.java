package org.launchcode.artcraftmarketplace.controllers;

import org.launchcode.artcraftmarketplace.models.ReviewReply;
import org.launchcode.artcraftmarketplace.repositories.ReviewReplyRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-replies")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewReplyController {

    private final ReviewReplyRepository reviewReplyRepository;

    public ReviewReplyController(
            ReviewReplyRepository reviewReplyRepository) {

        this.reviewReplyRepository = reviewReplyRepository;
    }

    @GetMapping
    public List<ReviewReply> getReplies(
            @RequestParam int reviewId) {

        return reviewReplyRepository.findByReviewId(reviewId);
    }

    @PostMapping
    public ReviewReply addReply(
            @RequestBody ReviewReply reply) {

        return reviewReplyRepository.save(reply);
    }

    @DeleteMapping("/{id}")
    public void deleteReply(
            @PathVariable int id) {

        reviewReplyRepository.deleteById(id);
    }
}