package org.launchcode.artcraftmarketplace.repositories;

import org.launchcode.artcraftmarketplace.models.ReviewReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewReplyRepository
        extends JpaRepository<ReviewReply, Integer> {

    List<ReviewReply> findByReviewId(int reviewId);
}