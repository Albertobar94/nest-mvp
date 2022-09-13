export const databaseExceptionsMessages = {
  /* -------------------------- DB Product Exceptions ------------------------- */
  product_amount_available_check: {
    status: 400,
    message: "The product amount must be a positive integer",
  },
  product_cost_check: {
    status: 400,
    message: "The cost must be a positive integer",
  },
  /* --------------------------- DB User Exceptions --------------------------- */
  chk_is_seller: { status: 400, message: "The user must have role 'seller'" },
  chk_is_buyer: {
    status: 400,
    message: "The user must have 'buyer' role",
  },
  user_username_unique: {
    status: 409,
    message: "The user already exists",
  },
};
