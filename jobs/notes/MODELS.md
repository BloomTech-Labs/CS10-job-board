Model Architecture Planning

UserManager
-create user
-create super user

User
-email
-is active?
-is staff?
-jwt

Employer
-company name
-img
-email
-first name
-last name
-summary
-applications inbox
-pw
-is employee?
-is active?
-publish date

JobPost
-company name
-title
-description
-company img
-location
-requirements
-min
-max
-is active?
-tags
-create date
-publish date

Employee
-company name
-img
-email
-first
-last
-description
-apps inbox
-pw
-is employer?
-publish date

UserMembership
-user (foreignkey to default user)
-stripe customer id
-membership

Post Save

Subscription
-user membership
-stripe subscription id (foreignkey to UserMembership)
-is active?
