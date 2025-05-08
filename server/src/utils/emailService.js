import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html
    };
    
    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }
    
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const options = {
    to: user.email,
    subject: 'Welcome to E-Commerce Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Welcome to E-Commerce Store!</h2>
        <p>Hello ${user.firstName || user.username},</p>
        <p>Thank you for registering with us. We're excited to have you as a customer!</p>
        <p>With your new account, you can:</p>
        <ul>
          <li>Shop our wide range of products</li>
          <li>Track your orders</li>
          <li>Save items to your wishlist</li>
          <li>Receive exclusive offers and promotions</li>
        </ul>
        <p>If you have any questions or need assistance, please don't hesitate to contact our customer support team.</p>
        <p>Happy shopping!</p>
        <p>Best regards,<br>The E-Commerce Team</p>
      </div>
    `
  };
  
  return sendEmail(options);
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const options = {
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Password Reset Request</h2>
        <p>Hello ${user.firstName || user.username},</p>
        <p>You requested a password reset. Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link is valid for 1 hour.</p>
        <p>Best regards,<br>The E-Commerce Team</p>
      </div>
    `
  };
  
  return sendEmail(options);
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (user, order) => {
  // Format order items
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.amount.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price.amount * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  const options = {
    to: user.email,
    subject: `Order Confirmation #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Order Confirmation</h2>
        <p>Hello ${user.firstName || user.username},</p>
        <p>Thank you for your order! We've received your order and are processing it now.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p style="margin: 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p style="margin: 10px 0 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        
        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px; text-align: right;">$${order.subtotal.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="padding: 10px; text-align: right;">$${order.shipping.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
              <td style="padding: 10px; text-align: right;">$${order.tax.amount.toFixed(2)}</td>
            </tr>
            ${order.discount.amount > 0 ? `
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Discount:</strong></td>
                <td style="padding: 10px; text-align: right;">-$${order.discount.amount.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">$${order.total.amount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="margin-top: 30px;">
          <h3>Shipping Information</h3>
          <p>
            ${order.shippingAddress.name}<br>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>
        </div>
        
        <p>You can track your order status by logging into your account.</p>
        <p>If you have any questions about your order, please contact our customer support team.</p>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>The E-Commerce Team</p>
      </div>
    `
  };
  
  return sendEmail(options);
};

// Send shipping confirmation email
export const sendShippingConfirmationEmail = async (user, order) => {
  const options = {
    to: user.email,
    subject: `Your Order #${order.orderNumber} Has Shipped`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Your Order Has Shipped</h2>
        <p>Hello ${user.firstName || user.username},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p style="margin: 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p style="margin: 10px 0 0;"><strong>Shipping Date:</strong> ${new Date().toLocaleDateString()}</p>
          ${order.trackingNumber ? `<p style="margin: 10px 0 0;"><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
          ${order.estimatedDelivery ? `<p style="margin: 10px 0 0;"><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>` : ''}
        </div>
        
        <p>You can track your order status by logging into your account.</p>
        <p>If you have any questions about your order, please contact our customer support team.</p>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>The E-Commerce Team</p>
      </div>
    `
  };
  
  return sendEmail(options);
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendShippingConfirmationEmail
};
