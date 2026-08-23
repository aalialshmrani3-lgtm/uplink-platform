ALTER TABLE `naqla3_commercial_transactions`
  ADD COLUMN `engagement_id` INT NULL;

CREATE INDEX `naqla3_transaction_engagement_idx`
  ON `naqla3_commercial_transactions` (`engagement_id`);
