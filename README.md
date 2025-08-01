[English](README.md) | [日本語](README-jp.md) | [العربية](README-ar.md) | [Português](README-pt.md) | [Español](README-es.md)

# Shenzhen_Enterprise
Shenzhen Enterprise mini-program
```markdown
# Shenzhen Enterprise Mini Program Documentation

## Overview
This is a cross-platform enterprise mini-program built with **UniApp** for businesses in Shenzhen. It features activity management, payment systems, authentication flows, and content sharing capabilities. The codebase demonstrates modern Vue.js practices with UniApp extensions.

## Key Features & Components

### 1. Activity Management (`activity.vue`)
```vue
<u-count-down :timestamp="invite_info.times" separator="zh"></u-count-down>
<button open-type="share">Continue Sharing</button>
```
- **Red Packet Campaigns**: Time-limited reward activities with countdown timers
- **Invitation System**: Track invited users and reward thresholds
- **WeChat Sharing**: Native share functionality with custom paths
- **Responsive Design**: Dynamic height calculation for navigation bars

### 2. Payment System (`pay.vue`)
```vue
<u-radio-group v-model="payType">
  <u-radio name="1">WeChat Pay</u-radio>
  <u-radio name="2">Voucher Deduction</u-radio>
</u-radio-group>
<button @click="pay()">Pay Now</button>
```
- **Dual Payment Methods**: 
  - WeChat Pay integration
  - Voucher/point redemption system
- **Secure Transactions**: Wrapped payment API with token authentication
- **Ad Integration**: Interstitial ads after successful payments

### 3. Enterprise Authentication (`auth.vue`)
```vue
<input name="name" placeholder="Company Name">
<button @click="upload(1)">Upload Business License</button>
```
- **Business Verification**: 
  - Company name registration
  - Business license upload
  - Legal person ID validation
- **Image Handling**: Upload preview and permission management

### 4. Content Management (`article.vue`)
```vue
<rich-text :nodes="info.content"></rich-text>
<button @click="downLoad(v.file)">Download Attachment</button>
```
- **Rich Text Display**: Secure HTML content rendering
- **File Management**: 
  - Image preview with zoom
  - Secure file downloads with permission checks
- **Comment System**: Nested comment threads with user tagging

### 5. Agreement Templates (`agreement.vue`)
```vue
<u-parse :html="content"></u-parse>
```
- **Dynamic Content Loading**: Fetch agreements from backend
- **Dual Template Support**: 
  - User agreements
  - Partnership contracts

### 6. Billing System (`bill/detail.vue`)
```vue
<view v-if="bill.status == 1">Status: Unpaid</view>
<button @click="viewPayType">Pay Now</button>
```
- **Payment Status Tracking**: Real-time bill status updates
- **Unified Payment Interface**: Reusable payment component
- **Voucher Calculations**: Dynamic point-to-cash conversion

## Technical Highlights

### Core Technologies
- **UniApp Framework**: Cross-platform development
- **Vue.js Composition**: Reactive data management
- **uView UI**: Consistent component library
- **WeChat Mini Program APIs**: Native capabilities integration

### Security Practices
```javascript
// Sample token validation
app.isLogin().then(() => {
  app.checkLogin2();
  that.getUser();
});
```
- API token validation for sensitive operations
- Photo album permission handling
- Secure payment parameters transmission

### Performance Optimizations
- On-demand image loading
- Comment pagination system
- WebView-based content rendering (`detail.vue`)
- Ad lazy-loading with error handling


## Usage Scenarios
1. **Marketing Campaigns**: Run timed promotions with share incentives
2. **Paid Content**: Monetize articles/videos with flexible payment options
3. **B2B Verification**: Onboard enterprise partners with authentication
4. **Financial Management**: Track and pay bills within mini-program
5. **Resource Sharing**: Distribute business documents securely

> **Note**: This mini-program integrates with WeChat ecosystem features including login, payment, and sharing capabilities while maintaining enterprise-grade security standards for business operations.
```
