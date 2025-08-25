## Complete Admin Dashboard Structure

The admin dashboard (`/admin`) is the comprehensive back-office system with the following complete structure:

### DASHBOARD (Main Admin Landing)
**URL**: `/admin/dashboard`

**Layout**: Grid-based dashboard with widgets
```
┌─────────────────────────────────────────────────────────┐
│ Welcome [First Name Last Name] - [Current Date]         │
├─────────────────────────────────────────────────────────┤
│ 2025-2026 Year Statistics (Aug 20 - Aug 20)            │
│ • Total Members: X                                      │
│ • Active Groups: X                                      │
│ • Events This Year: X                                   │
│ • Pending Registrations: X                              │
├─────────────────────────────────────────────────────────┤
│ Next Upcoming Event                                     │
│ [Event Details Block]                                   │
├─────────────────────────────────────────────────────────┤
│ Approval Blocks                                         │
│ • New Registration Requests: [Count] [Review Button]    │
│ • New Group Creation Requests: [Count] [Review Button]  │
├─────────────────────────────────────────────────────────┤
│ Recent Activities Log                                   │
│ • [Timestamp] [User] created group "X"                  │
│ • [Timestamp] [User] joined event "Y"                   │
│ • [Show More] button                                    │
├─────────────────────────────────────────────────────────┤
│ Staff Notes (Shared TODO System)                       │
│ • Note by [Staff Member] - [Date]: "Text"              │
│ • [Add Note] [Delete Note] buttons                      │
└─────────────────────────────────────────────────────────┘
```

### USER MANAGEMENT
**URL**: `/admin/users`

**Main Page Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Users Management                            [+ New User] │
├─────────────────────────────────────────────────────────┤
│ Filters: [Alphabetical ▼] [Member Status ▼] [Date ▼]    │
│ Search: [________________] 🔍                           │
├─────────────────────────────────────────────────────────┤
│ Current Members (X)                                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Avatar] John Doe - I3 - President                  │ │
│ │ john@isep.fr • Joined: 01/09/2024 • [Edit] [Email] │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Avatar] Jane Smith - A2 - Member                   │ │
│ │ jane@isep.fr • Joined: 02/09/2024 • [Edit] [Email] │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Former Members (X) [Expand/Collapse]                   │
│ • List of former members...                             │
└─────────────────────────────────────────────────────────┘
```

**User Edit Page**: `/admin/users/[userId]`
Multiple internal tabs:
- **Main Tab**: Personal info, photo, email, password reset, bio, promotion year
- **Permissions Tab**: Role assignments and special permissions
- **Instruments Tab**: Instrument skills and levels management
- **Badges Tab**: Badge assignment and removal
- **Groups Tab**: Current/past group memberships with direct links to group admin
- **Events Tab**: Complete participation history
- **Activity Log Tab**: All user actions with timestamps

**New User Creation Modal**:
```
Create New User - Step 1: Personal Information
├── Basic Information
│   ├── First Name [_________]
│   ├── Last Name [__________]
│   ├── Email [______________]
│   └── Birth Date [_________]
├── ISEP Information  
│   ├── Promotion [I1▼] [I2] [I3] [A1] [A2] [Former] [Graduate] [Ex-Member]
│   └── Student Status [Current Student▼] [Graduate] [Former]
└── [Next Step →]

Create New User - Step 2: Association Role & Permissions
├── Primary Role
│   ├── Role [Member▼] [President] [Vice-President] [Secretary] [Treasurer] [Communications] [Former-Member]
│   └── Full Access Override [□] (Bypass all permission checks)
├── Additional Permissions
│   ├── [□] Admin Dashboard Access
│   ├── [□] User Management
│   ├── [□] Band Management  
│   ├── [□] Event Creation
│   ├── [□] Event Management
│   ├── [□] Newsletter Access
│   ├── [□] Content Management
│   ├── [□] Media Library Access
│   └── [□] Files Access (Restricted)
└── [← Back] [Next Step →]

Create New User - Step 3: Instruments & Skills
├── Instruments Played
│   ├── Add Instrument [Guitar ▼] Level [Beginner ▼] [+ Add]
│   ├── Current: Guitar (Intermediate), Piano (Advanced)
│   └── [Edit] [Remove] options for each
├── Musical Experience
│   ├── Years of Experience [_____]
│   ├── Previous Bands [_________]
│   └── Preferred Genres [Rock] [Pop] [Jazz] [Classical] [+Add]
└── [← Back] [Next Step →]

Create New User - Step 4: Badges & Recognition  
├── Achievement Badges
│   ├── [□] Founding Member
│   ├── [□] Former Board 2024-25
│   ├── [□] Concert Performer  
│   ├── [□] Jam Session Regular
│   ├── [□] Studio Recording Artist
│   └── [□] Event Organizer
├── Custom Badge
│   ├── Badge Name [_________]
│   ├── Badge Description [_________]
│   └── Badge Color [#FF6B35] [Color Picker]
└── [← Back] [Next Step →]

Create New User - Step 5: Profile & Bio
├── Profile Information
│   ├── Profile Photo [Upload] [Browse]
│   ├── Bio (FR) [Large text area]
│   ├── Bio (EN) [Large text area]
│   └── Public Profile [□] Visible to all members
├── Contact Preferences  
│   ├── [□] Receive Newsletter
│   ├── [□] Event Notifications
│   ├── [□] Group Invitations
│   └── [□] System Updates
└── [← Back] [Next Step →]

Create New User - Step 6: Review & Create
├── Personal Information
│   └── [All entered information displayed for review]
├── Role & Permissions Summary
│   └── [Selected role and permissions listed]  
├── Instruments & Skills Summary
│   └── [Instruments with levels displayed]
├── Badges Summary
│   └── [Selected badges shown]
├── Profile Summary
│   └── [Bio and preferences displayed]
├── Account Setup
│   ├── Send Welcome Email [□] (checked by default)
│   ├── Temporary Password [Auto-generated] [Show/Hide]
│   └── Require Password Change [□] (checked by default)
└── [← Back] [Create User] [Cancel]

Post-Creation Actions:
├── [✓] User Created Successfully
├── [📧] Welcome Email Sent
├── [🔗] Copy Profile Link
├── [📝] Add to Group (optional)
└── [👤] View User Profile
```

### BANDS MANAGEMENT
**URL**: `/admin/bands`

**Main Page**:
```
┌─────────────────────────────────────────────────────────┐
│ Bands Management                           [+ New Band]  │
├─────────────────────────────────────────────────────────┤
│ Filters: [Status ▼] [Recruitment ▼] [Alphabetical ▼]    │
│ Search: [________________] 🔍                           │
├─────────────────────────────────────────────────────────┤
│ Active Bands (X)                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Band Photo] The Rockers                            │ │
│ │ 4/5 members • Seeking: Drummer • [Edit] [Email All] │ │
│ │ Admin: John Doe • Created: 01/09/2024               │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Inactive/Disbanded Bands (X) [Expand/Collapse]         │
└─────────────────────────────────────────────────────────┘
```

**Band Edit Page**: `/admin/bands/[bandId]`
Multiple internal tabs:
- **Information Tab**: Name, photo, member count, recruitment status, statistics
- **Members Tab**: Role assignments, admin designation, add/remove members
- **Events Tab**: Past and upcoming performances/rehearsals
- **Event Details Tabs**: Per-event management with setlist oversight
- **Activity Log Tab**: All band-related actions

**Band Creation Modal**:
```
Create New Band
├── Basic Information
│   ├── Band Name [___________]
│   ├── Description [_________]
│   └── Photo [Upload]
├── Instrument Requirements
│   ├── Guitarists: [0] / [2] max
│   ├── Bassists: [0] / [1] max  
│   ├── Drummers: [0] / [1] max
│   ├── Keyboardists: [0] / [2] max
│   └── Vocalists: [0] / [3] max
├── Member Assignment (Optional)
│   └── [Search and assign members to roles]
├── Settings
│   ├── Administrator: [Select Member ▼]
│   └── Recruitment Status: [□] Open
└── [Create] [Cancel]
```

### EVENTS MANAGEMENT
**URL**: `/admin/events`

**Main Page**:
```
┌─────────────────────────────────────────────────────────┐
│ Events Management                        [+ New Event]   │
├─────────────────────────────────────────────────────────┤
│ [Event Types Config] [Venues Management]                │
├─────────────────────────────────────────────────────────┤
│ Filters: [Type ▼] [Date ▼] [Status ▼]                    │
│ Search: [________________] 🔍                           │
├─────────────────────────────────────────────────────────┤
│ TODAY'S EVENTS (Priority Display)                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔴 LIVE: Jam Session at NDC                         │ │
│ │ 19:00-22:00 • 12 participants • [Manage]            │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Upcoming Events (X)                                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Date] Concert - "Spring Showcase"                  │ │
│ │ Supersonic Venue • 3 bands • [Edit] [Stats]         │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Past Events (X) [Expand/Collapse]                      │
└─────────────────────────────────────────────────────────┘
```

**Event Creation Modal** (Type-Specific):
```
Create New Event
├── Basic Information
│   ├── Event Type [Concert ▼]
│   ├── Title [_____________]
│   ├── Description [_______]
│   ├── Date & Time [_______]
│   └── Venue [Select ▼]
├── Type-Specific Settings
│   ├── If JAM:
│   │   └── Pre-assign Members: [Search & Select]
│   ├── If CONCERT:  
│   │   └── Performing Bands: [Search & Select]
│   ├── If REHEARSAL:
│   │   ├── Assigned Band: [Select Band ▼]
│   │   └── Non-band Participants: [Search & Select]
│   └── If SHOWCASE/OTHER:
│       └── Special Requirements: [_______]
├── Visibility & Settings
│   ├── Public Event: [□]
│   ├── Pinned on Homepage: [□]
│   └── Email Reminder: [□]
└── [Create] [Cancel]
```

### VENUES MANAGEMENT
**URL**: `/admin/venues`

```
┌─────────────────────────────────────────────────────────┐
│ Venues Management                         [+ New Venue]  │
├─────────────────────────────────────────────────────────┤
│ Default Venues                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🏫 ISEP NDC (Notre-Dame-des-Champs)                 │ │
│ │ 28 Rue Notre-Dame-des-Champs, Paris 6e              │ │
│ │ Metro: Notre-Dame-des-Champs (12)                   │ │
│ │ Capacity: 50 • Equipment: Full backline             │ │
│ │ Events History: [12 events] [View] [Edit]           │ │
│ │ Staff Notes: "New piano tuned monthly"              │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🏫 ISEP NDL (Notre-Dame-de-Lorette)                 │ │
│ │ 10 Rue de Vanves, Issy-les-Moulineaux               │ │
│ │ Events History: [8 events] [View] [Edit]            │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ External Venues                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🏛️ Supersonic                                        │ │
│ │ Private venue • €1000 with tech                     │ │
│ │ ⚠️ Staff Warning: "Good venue - recommended"        │ │
│ │ Events History: [2 events] [View] [Edit]            │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🚫 QG Oberkampf                                     │ │
│ │ ❌ BLACKLISTED: "DO NOT BOOK - Poor management"     │ │
│ │ Last Used: Never again                               │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### CONTENT MANAGEMENT
**URL**: `/admin/content`

```
┌─────────────────────────────────────────────────────────┐
│ Content Management                                      │
├─────────────────────────────────────────────────────────┤
│ Page Content                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📄 Bureau Page                              [Edit]  │ │
│ │ Vision Text (FR): "Notre vision pour 2025-26..."    │ │
│ │ Vision Text (EN): "Our vision for 2025-26..."       │ │
│ │ Last Modified: 01/09/2024 by Maxime                 │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🏠 Homepage                                 [Edit]  │ │
│ │ Motto (FR): "La musique unit les étudiants"         │ │
│ │ Motto (EN): "Music unites students"                 │ │
│ │ Last Modified: 25/08/2024 by Sarah                  │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ℹ️ Association Page                         [Edit]  │ │
│ │ Mission Statement, Join Conditions, etc.            │ │
│ │ Last Modified: 20/08/2024 by Armand                 │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### MEDIA LIBRARY
**URL**: `/admin/media`

```
┌─────────────────────────────────────────────────────────┐
│ Media Library                              [📤 Upload]  │
├─────────────────────────────────────────────────────────┤
│ Folders: [Homepage] [Association] [Events] [Bands]      │
├─────────────────────────────────────────────────────────┤
│ Current: Homepage Images                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [🖼️ Thumbnail] hero-image.jpg                       │ │
│ │ 1920x1080 • 450KB • Used in: Homepage hero          │ │
│ │ [Replace] [Delete] [Copy URL]                       │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [🖼️ Thumbnail] concert-photo-1.jpg                  │ │
│ │ 1200x800 • 320KB • Used in: Events showcase         │ │
│ │ [Replace] [Delete] [Copy URL]                       │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### COMMUNICATION CENTER
**URL**: `/admin/communication`

**Main Communication Dashboard**:
```
┌─────────────────────────────────────────────────────────┐
│ Communication Center                                    │
├─────────────────────────────────────────────────────────┤
│ Quick Actions                                           │
│ [📧 Send Newsletter] [📅 Event Reminder] [👤 Email User] │
├─────────────────────────────────────────────────────────┤
│ Email History                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📧 Newsletter: "Welcome September 2024"             │ │
│ │ Sent to: 45 members • Opened: 38 (84%) • 01/09/2024│ │
│ │ [View] [Resend] [Analytics]                         │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 Event Reminder: "Jam Session Tonight"            │ │
│ │ Sent to: 12 participants • Opened: 10 • 30/08/2024 │ │
│ │ [View] [Analytics]                                  │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Newsletter Creation Interface**:
```
Create Newsletter
├── Recipients
│   ├── [□] All Members (45)
│   ├── [□] Active Members Only (42) 
│   ├── [□] Specific Groups: [Select ▼]
│   └── [□] Custom List: [Search & Select]
├── Content  
│   ├── Subject (FR): [________________]
│   ├── Subject (EN): [________________]
│   ├── Template: [Newsletter ▼] [Event ▼] [Custom ▼]
│   └── Content Editor: [Rich Text Editor]
├── Settings
│   ├── Send Immediately: [□]
│   ├── Schedule: [Date/Time Picker]
│   └── Test Recipients: [Add emails]
└── [Send Test] [Schedule] [Send Now]
```

### FILES/REPORTS MANAGEMENT
**URL**: `/admin/files`

**Restricted Access**: President, Vice-Presidents, Secretary only
```
┌─────────────────────────────────────────────────────────┐
│ Staff Files & Reports                    [📤 Upload]    │
├─────────────────────────────────────────────────────────┤
│ Folder Structure                                        │
│ 📁 2025-2026/                                          │
│   📁 Bureau Meetings/                                  │
│     📄 meeting-minutes-sept-2024.pdf                   │
│     📄 budget-proposal-oct-2024.xlsx                   │
│   📁 Financial Reports/                                │
│     📄 q1-financial-report.xlsx                        │
│   📁 Event Planning/                                   │
│     📄 concert-venue-quotes.pdf                        │
│ 📁 2024-2025/ (Archived)                               │
│   📁 [Previous year files...]                          │
├─────────────────────────────────────────────────────────┤
│ Access Control                                          │
│ • President: Full Access                                │
│ • Vice-Presidents: Full Access                          │
│ • Secretary: Full Access                                │
│ • Others: No Access                                     │
└─────────────────────────────────────────────────────────┘
```

### BOARD MEMBERS MANAGEMENT
**URL**: `/admin/board`

```
┌─────────────────────────────────────────────────────────┐
│ Board Members Management                                │
├─────────────────────────────────────────────────────────┤
│ Current Board (2025-2026)                              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 👑 President: Maxime Dupont                         │ │
│ │ Bio (FR): "Passionné de rock depuis 10 ans..."      │ │
│ │ Bio (EN): "Rock enthusiast for 10 years..."         │ │
│ │ Photo: [Current] [Change] [Edit Bio]                │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎸 Vice-President: Armand Martin                    │ │
│ │ Bio: [Edit content in both languages]               │ │
│ │ [Edit Bio]                                          │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Department Heads                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎨 Creative Director: Auré Beaumont                 │ │
│ │ 📢 Communications: Auré Beaumont                    │ │
│ │ [Assign Roles] [Edit Bios]                          │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Board History                                           │
│ [2024-2025] [2023-2024] [View Archives]                │
└─────────────────────────────────────────────────────────┘
```

### ROLES & PERMISSIONS
**URL**: `/admin/roles`

```
┌─────────────────────────────────────────────────────────┐
│ Roles & Permissions Management                          │
├─────────────────────────────────────────────────────────┤
│ Core Roles (Cannot be deleted)                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 👑 President                                        │ │
│ │ Permissions: ALL (Full Access Override)             │ │
│ │ Current Holders: Maxime Dupont                      │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎸 Vice-President                                   │ │
│ │ Permissions: Admin Dashboard, User Management, etc.  │ │
│ │ Current Holders: Armand Martin, Sarah Durand        │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Custom Roles                                  [+ Add]  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎤 Event Manager                           [Edit]   │ │
│ │ Permissions: Event Creation, Event Management        │ │
│ │ Assigned to: Shane Wilson                           │ │
│ │ [Delete Role]                                       │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Available Permissions                                   │
│ • Admin Dashboard Access                                │
│ • User Management                                       │
│ • Band Management                                       │
│ • Event Creation                                        │
│ • Event Management                                      │
│ • Newsletter Access                                     │
│ • Content Management                                    │
│ • Media Library Access                                  │
│ • Files Access (Restricted)                            │
└─────────────────────────────────────────────────────────┘
```

### SETTINGS
**URL**: `/admin/settings`

```
┌─────────────────────────────────────────────────────────┐
│ System Settings                                         │
├─────────────────────────────────────────────────────────┤
│ Site Configuration                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Site Name: ISEP Bands                               │ │
│ │ Primary Color: [#FF6B35] [Color Picker]               │ │
│ │ Secondary Color: [#2C3E50] [Color Picker]            │ │
│ │ Default Language: [French ▼]                         │ │
│ │ Maintenance Mode: [□] Enable                         │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Email Configuration                                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ SMTP Server: [smtp.gmail.com]                       │ │
│ │ From Address: [noreply@isepbands.fr]                │ │
│ │ Newsletter Template: [Default ▼] [Edit]             │ │
│ │ [Test Email Configuration]                          │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ System Workers & Automation                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Email Queue Worker: [●] Running                     │ │
│ │ Event Reminder Worker: [●] Running                  │ │
│ │ Membership Renewal Check: [●] Running               │ │
│ │ Database Cleanup Worker: [●] Running                │ │
│ │ [Restart All] [View Logs]                          │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Legal Information                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Association Address:                                │ │
│ │ [28 Rue Notre-Dame-des-Champs, 75006 Paris]        │ │
│ │ Contact Email: [contact@isepbands.fr]              │ │
│ │ Legal Representative: [Maxime Dupont]              │ │
│ │ SIRET: [Optional field]                            │ │
│ │ [Update Legal Info]                                │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### DATABASE MANAGEMENT (Optional)
**URL**: `/admin/database`

**⚠️ High-Risk Operations - Restricted Access**
```
┌─────────────────────────────────────────────────────────┐
│ Database Administration                                 │
│ ⚠️ WARNING: These operations can cause data loss       │
├─────────────────────────────────────────────────────────┤
│ Database Status                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Status: [●] Connected                               │ │
│ │ Total Records: 1,247                                │ │
│ │ Last Backup: 31/08/2024 02:00                      │ │
│ │ Database Size: 15.4 MB                              │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Emergency Operations                                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [⚠️ Force Delete User] - Requires confirmation      │ │
│ │ [⚠️ Reset All Passwords] - Nuclear option          │ │
│ │ [⚠️ Clear Event Data] - Remove all events          │ │
│ │ [📥 Export Database] - Full backup                  │ │
│ │ [📤 Import Database] - Restore from backup         │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Query Console (Advanced Users Only)                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ SELECT * FROM users WHERE...                        │ │
│ │ [Execute Query] [Query History]                     │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### ARCHIVES
**URL**: `/admin/archives`

```
┌─────────────────────────────────────────────────────────┐
│ Archives Management                                     │
├─────────────────────────────────────────────────────────┤
│ Archived Events                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 2024-2025 Academic Year                          │ │
│ │ • Spring Concert 2024 (March 15)                    │ │
│ │ • Final Jam Session (June 20)                       │ │
│ │ • Music Festival Participation (May 3)              │ │
│ │ [View Details] [Export Data] [Restore Event]        │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Former Users                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 👥 Graduated Members (2024): 8 users                │ │
│ │ 👥 Former Members: 12 users                         │ │
│ │ 👥 Expelled Members: 1 user                         │ │
│ │ [View Details] [Export List] [Reactivate Account]   │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Disbanded Groups                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎸 "Electric Dreams" - Disbanded June 2024         │ │
│ │ Reason: Members graduated                           │ │
│ │ Final Performance: Spring Concert                   │ │
│ │ [View History] [Member List] [Performance Archive]  │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Data Retention                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Auto-archive after: [3 years ▼]                    │ │
│ │ Permanent deletion: [7 years ▼]                    │ │
│ │ Next cleanup: January 15, 2025                      │ │
│ │ [Configure] [Manual Cleanup]                       │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### NOTIFICATIONS SYSTEM (Low Priority)
**URL**: `/admin/notifications`

```
┌─────────────────────────────────────────────────────────┐
│ Site Notifications Management                           │
├─────────────────────────────────────────────────────────┤
│ Active Notifications                                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📢 "Welcome to the new academic year!"              │ │
│ │ Type: Info • Target: All Users                      │ │
│ │ Expires: 30/09/2024 • [Edit] [Deactivate]          │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Create New Notification                    [+ Create]   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Message: [_________________________________]        │ │
│ │ Type: [Info ▼] [Warning ▼] [Success ▼] [Error ▼]    │ │
│ │ Target: [All Users ▼] [Specific Group ▼]            │ │
│ │ Duration: [Until dismissed ▼] [Time limit ▼]        │ │
│ │ Show on: [All pages ▼] [Specific pages ▼]           │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Notification History                                    │
│ • "Jam session cancelled due to equipment" - Expired   │
│ • "New band registration open" - Dismissed             │
│ • "Concert tickets available" - Completed              │
└─────────────────────────────────────────────────────────┘
```

## Admin Navigation Structure

The admin panel uses a sidebar navigation with the following hierarchy:

```
🏠 Dashboard
├── 👥 Users
│   ├── All Users
│   ├── Pending Approvals
│   └── Former Members
├── 🎸 Bands  
│   ├── Active Bands
│   ├── Inactive Bands
│   └── Creation Requests
├── 📅 Events
│   ├── Upcoming Events
│   ├── Past Events
│   ├── Event Types
│   └── Venues
├── 🏛️ Venues
│   ├── ISEP Venues
│   ├── External Venues
│   └── Blacklisted Venues
├── 📝 Content
│   ├── Page Content
│   ├── Media Library
│   └── Site Settings
├── 📧 Communication
│   ├── Send Newsletter
│   ├── Email History
│   └── Templates
├── 📁 Files (Restricted)
│   ├── Current Year
│   ├── Archives
│   └── Upload
├── 👑 Board
│   ├── Current Board
│   ├── Department Heads
│   └── Board History
├── ⚙️ System
│   ├── Roles & Permissions
│   ├── Settings
│   ├── Database (Optional)
│   └── Notifications
└── 📚 Archives
    ├── Past Events
    ├── Former Users
    └── Disbanded Groups
```

## Admin Dashboard Features Summary

### Key Administrative Capabilities:

1. **Complete User Lifecycle Management**: Registration approval, profile editing, role assignment, archiving
2. **Dynamic Group Management**: Creation, member assignment, recruitment status, performance tracking
3. **Comprehensive Event System**: Type-specific creation, automated notifications, setlist management
4. **Content Management**: Bilingual content editing, media library, site customization
5. **Communication Hub**: Newsletter campaigns, targeted emails, automated reminders
6. **Analytics & Reporting**: User activity, event statistics, group performance metrics
7. **System Administration**: Database management, worker monitoring, backup systems
8. **Archive Management**: Historical data preservation, graduated member tracking

### Access Control Levels:

- **President**: Full access to all systems including financial files
- **Vice-Presidents**: Complete administrative access except restricted files
- **Secretary**: Administrative access plus financial document access
- **Treasurer**: Financial focus with selective administrative permissions
- **Communications Head**: Communication tools and content management
- **Custom Roles**: Granular permission assignment for specific needs

This admin system provides complete control over the ISEP Bands platform while maintaining security and user experience standards.# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with the ISEP Bands project codebase.

## Development Commands

- **Development server**: `npm run dev` - Starts Next.js development server at http://localhost:3000
- **Build**: `npm run build` - Creates production build
- **Start**: `npm run start` - Runs production build
- **Lint**: `npm run lint` - Runs ESLint with Next.js configuration
- **Tests**: `npm test` - Runs Jest tests
- **E2E Tests**: `npm run test:e2e` - Runs Playwright end-to-end tests
- **Database migrations**: `npx prisma migrate dev` - Apply database migrations
- **Database seeding**: `npx prisma db seed` - Populate database with seed data
- **Generate Prisma client**: `npx prisma generate` - Generate Prisma client after schema changes

## Project Overview

**ISEPBANDS.FR** is a comprehensive music platform for the ISEP music association, built as a 3-tier system:

1. **Showcase Layer** (Public): Association presentation, events, team pages
2. **Mid-office Layer** (Members): Group management, profile settings, event participation
3. **Back-office Layer** (Admin): Complete administrative control

### Key Milestones
- **MVP Release**: September 1, 2025
- **BANDS Module**: September 25, 2025
- **EVENTS Module**: October 15, 2025

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19
- **Database**: MySQL + Prisma ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS v4
- **Internationalization**: next-international (FR/EN)
- **Icons**: Font Awesome
- **Language**: TypeScript

### Directory Structure

#### Core Application (`src/app/`)
- **`[lang]/`**: Internationalized routes (FR/EN)
    - **`/` (root)**: Homepage with different layouts (showcase vs logged-in dashboard)
    - **`club/`**: About the association with conditional content
    - **`bands/`**: Music groups with showcase/member views
    - **`events/`**: Events with public/member/admin variants
    - **`board/`**: Team page with decorative garland design
    - **`admin/`**: Complete administrative dashboard
    - **`profile/`**: User profiles and settings
    - **`login/`**: Login page
    - **`register/`**: 6-step registration process

#### Components (`src/components/`)
- **`admin/`**: All administrative interface components
- **`bands/`**: Music group components
- **`events/`**: Event management components
- **`garland/`**: Special decorative garland system for team page
- **`profile/`**: User profile management
- **`ui/`**: Reusable UI components

## Complete Feature List

## Complete Page Structure & Content

### NAVBAR (Global)
- **Search Bar**: Universal search for members, groups, events, and content
- **Language Toggle**: FR/EN switching
- **Authentication**: Login/Profile/Logout states
- **Navigation**: Dynamic menu based on user role (public/member/admin)

### HOMEPAGE (`/`)

#### SHOWCASE Version (Not Logged In)
```
- WHO WE ARE (Brief introduction)
- OUR HIGHLIGHT EVENTS  
- CALL TO ACTION (Join us button)
- LATEST NEWS
- UPCOMING EVENTS
```

#### MEMBER Dashboard (Logged In)
```
- WELCOME [First Name Last Name]
- LATEST NEWS
- GROUPS CURRENTLY SEEKING MEMBERS (or "No current activity")
- NEW MEMBERS WHO JUST JOINED THE ASSOCIATION (2nd block)
- WHAT'S NEW IN YOUR GROUPS
- YOUR UPCOMING EVENTS
```

### CLUB PAGE (`/club`)

#### SHOWCASE Version (Not Logged In)
```
- WHO IS ISEPBANDS (ISEP school context)
- OUR VISION & MISSION AS A MUSIC ASSOCIATION
- WHO DO WE DO THIS FOR?
- WHAT DO WE DO AT BANDS?
- HOW TO JOIN US? (3 conditions + annual membership renewal notice)
```

#### MEMBER Version (Logged In)
```
Same content EXCEPT remove "HOW TO JOIN US" section
```

### BANDS PAGE (`/bands`)

#### SHOWCASE Version (Not Logged In)
```
- WHAT IS A BAND WITH US?
- WHAT DO WE DO IN A BAND? (Events, shows, etc.)
- WHY JOIN A BAND?
- HOW TO JOIN → CTA BUTTON
- OUR EXISTING BANDS THIS YEAR
```

#### MEMBER Version (Logged In)
```
- YOUR CURRENT GROUPS (Button: "View past/inactive groups")
  OR "YOU DON'T HAVE A GROUP YET" with explanations
- CREATE A GROUP button
- Click on group → Goes to group page
- GROUPS SEEKING MEMBERS
- COMPLETE LIST OF ISEPBANDS GROUPS THIS YEAR
```

### EVENTS PAGE (`/events`)

#### SHOWCASE Version (Not Logged In)
```
- Next upcoming public event featured at top
- ISEPBANDS OFFERS NUMEROUS EVENTS THROUGHOUT THE YEAR
- FEATURED: NEW MID-YEAR CONCERT FOR JANUARY (descriptive block)
- REVISITED JAMS 2025-26 STYLE (descriptive block)  
- MUSIC FESTIVAL (descriptive block)
- STUDIO SESSIONS FOR COVERS (descriptive block)
- AFTERWORKS (networking events)
- CALL TO ACTION
- OUR UPCOMING FUTURE EVENTS (same block as homepage)
```

#### MEMBER Version (Logged In)
```
- ATTENTION: NEXT REHEARSAL FOR YOUR GROUP "X" (if applicable)
- TOP OF PAGE: UPCOMING EVENTS
- EVENT CALENDAR
- ASSOCIATION EVENTS LIST (same as showcase version)
```

#### ADMIN Addition (If Admin)
```
- "Create New Event" button
```

### BOARD PAGE (`/board`)

#### SHOWCASE Version (All Users)
```
- BOARD MEMBERS (with decorative garland system)
- DEPARTMENT HEADS  
- BOARD'S VISION FOR THE CURRENT YEAR
```

#### ADMIN Addition (If Admin)
```
- "Edit This Page" button
```

### BANDS Module Features (Sept 25, 2025)

#### Group Management
- **Group Creation**: Any member can create groups (requires validation)
- **Multi-admin System**: Multiple group administrators
- **Instrument Requirements**: Define needed musicians (0/2 keyboardists, etc.)
- **Recruitment Status**: Open/closed search independent of available slots
- **Recommendation System**: Suggest groups to available musicians
- **Group Limits**: Maximum 2 active groups per user (admin override possible)
- **Group Pages**: Individual pages for each group
- **Group History**: Track active/inactive/disbanded groups

#### User Integration
- **Profile Groups Section**: Current and past group memberships
- **Search Status**: "Available to join group" toggle
- **Auto-deactivation**: Status changes when joining group

### EVENTS Module Features (Oct 15, 2025)

#### Event Types & Management
- **Event Types**: Concert, Jam, Sale, Showcase, Rehearsal
- **Pinned Events**: Featured events on homepage
- **Dynamic Calendar**: Google Calendar sync with iCal subscription
- **Automatic Archiving**: Past events management
- **Email Notifications**: Automatic event day reminders
- **Hello-Asso Integration**: Ticketing system with statistics

#### Event-Specific Features

##### JAM Events
- **Participation Requests**: Users can request to participate
- **Admin Control**: Accept/reject participants

##### REHEARSAL Events
- **Group Assignment**: Automatic group association
- **Non-group Members**: Add external participants
- **Email Reminders**: Same-day notifications
- **Private Visibility**: Only visible to participants (calendar shows to all members)

##### CONCERT Events
- **Group Programming**: Assign performing groups
- **Participation Requests**: Groups can apply with motivation
- **Preparation Mode**: Triggers rehearsal scheduling
- **Setlist Management**: Collaborative song selection and voting system
    - YouTube/Spotify integration for song suggestions
    - Automatic metadata extraction (cover, title, artist)
    - Member voting on song selection
    - Instrument assignment per song
    - Printable setlists

## Complete Admin Dashboard Structure

### DASHBOARD (Main)
- Welcome message with user name and current date
- Current year statistics (Aug 20 - Aug 20)
- Next upcoming event display
- Approval blocks for new registrations and group creations
- Recent activities log with timestamps and user attribution
- Staff notes system (TODO-like with user attribution and deletion)

### USER MANAGEMENT
- **User List**: Complete member directory with filters
    - Alphabetical sorting
    - Current/former member status filtering
    - Registration date sorting
    - Bureau member history
- **Search**: Advanced user search functionality
- **Create User**: Manual user creation with full profile setup
- **User Admin Pages** (Multiple internal pages):
    - **Main Page**: Photo, name, email, password reset, bio, promotion year
    - **Permissions & Roles**: Role management and special permissions
    - **Instruments**: Instrument skills management
    - **Badges**: Badge assignment system
    - **Groups**: Active/inactive group memberships with admin links
    - **Events**: Participation history
    - **Activity Log**: User action history
- **Email System**: Send emails to individual users

### BANDS MANAGEMENT
- **Band List**: Active/inactive groups with filters and search
- **Create Band**: Full setup with instrument requirements and member assignment
- **Band Admin Pages** (Multiple internal pages):
    - **Information**: Name, photo, member count, recruitment status, statistics
    - **Members**: Role assignments with profile links, admin designation
    - **Events**: Past and upcoming events
    - **Event Details**: Setlist management with voting results
    - **Activity Log**: Band action history
- **Email System**: Send emails to entire groups

### EVENTS MANAGEMENT
- **Event List**: Past/upcoming with today's events pinned
- **Event Types Management**: Configure available event types
- **Create Event**: Type-specific creation with automatic associations
- **Event Admin Pages**:
    - **Details**: Title, description, venue, date management
    - **Groups**: Manage associated performing groups
    - **Hello-Asso Integration**: Ticketing management (future)
    - **Statistics**: Event performance metrics

### VENUES MANAGEMENT
- **Venue Registry**: All event locations with details
- **Default Venues**: NDC and NDL campuses with access info
- **Venue History**: Event history per location
- **Staff Notes**: Venue-specific notes and warnings ("AVOID - DO NOT REBOOK")

### CONTENT MANAGEMENT
- **Bureau Page**: Vision text management (bilingual FR/EN)
- **Homepage**: Motto and dynamic content
- **Site Content**: General site text management

### MEDIA LIBRARY
- **Photo Management**: Site imagery and association photos
- **File Organization**: Categorized media storage

### COMMUNICATION
- **Newsletter**: Bulk email campaigns with custom templates
- **Event Reminders**: Targeted event notifications
- **Individual Emails**: Direct member communication
- **Group Emails**: Group-specific messaging

### NOTIFICATIONS (Low Priority)
- **User Notifications**: Temporary pop-up messages
- **Group Notifications**: Group-specific announcements

### FILES (Reports)
- **Document Storage**: Staff-only cloud storage
- **Organization**: Year-based folder structure
- **Access Control**: Limited to President, VP, Secretary roles
- **Content**: Meeting minutes, reports, administrative documents

### BOARD MEMBERS
- **Executive Management**: Board member profiles per year
- **Bio Management**: Public biography content for showcase
- **Historical Records**: Past board compositions

### ROLES & PERMISSIONS
- **Permission Overview**: All system permissions display
- **Role Management**: Create/delete non-core roles
- **Core Roles**: Protected roles (Member, Former Member, President, VP, etc.)
- **Badge Management**: Achievement badge system

### SETTINGS
- **System Control**: Worker management, color scheme customization
- **Legal Info**: Terms of service and legal address management
- **Site Configuration**: Global site settings

### DATABASE (Optional)
- **Direct Management**: Database administration tools
- **Force Operations**: Emergency database operations

### ARCHIVES
- **Historical Data**: Past events, former users, archived content
- **Data Preservation**: Long-term storage management

## Database Schema (Key Entities)

### Core User System
```prisma
model User {
  // Authentication
  email, password, emailVerified
  
  // Personal Info  
  firstName, lastName, birthDate, bio
  
  // ISEP Status
  isepPromotion // I1, I2, I3, A1, A2, Former, Graduate, Ex-Member
  
  // Association Status
  associationStatus // with membership history
  lastSeenAt // activity tracking
  
  // Permissions
  roles // President, VP, Secretary, Treasurer, Communications, Member
  isFullAccess // bypass all permissions
  
  // Relationships
  instruments, groups, events, badges
}
```

### Music Groups
```prisma
model Group {
  name, description, photo
  instrumentRequirements // dynamic instrument needs
  members // with roles per instrument
  administrators // multiple admins possible
  recruitmentOpen // search status
  status // active/inactive/disbanded
  events, setlists
}
```

### Events System
```prisma
model Event {
  title, description, type, date, venue
  isPinned, isVisible
  groups, participants
  setlists // for concerts
  helloAssoIntegration // ticketing
}
```

## Special Features

### Garland Design System (Team Page)
The team page features a unique responsive design with decorative garlands:
- **Desktop**: Up to 3 member cards per garland with hanging lights
- **Mobile**: Single card per short garland section
- **Responsive**: Automatically adjusts card distribution based on viewport
- **SVG Generation**: Dynamic garland creation with attachment points
- **Lighting Effects**: Animated lights with opacity variations
- **Card Positioning**: Calculated positioning between garland curves

### Search System
- **Global Search**: Members, groups, and content
- **Keyword Support**: Instrument-based searches ("guitarist", "drummer")
- **Categorized Results**: Separated sections for different content types

### Notification System
- **Email Automation**: Event reminders, group invitations, status changes
- **Newsletter**: Bulk communications with custom templates
- **Real-time Updates**: Activity feeds and status changes

### File Management
- **AWS S3 Integration**: Secure file storage
- **Presigned URLs**: Direct upload capability
- **Storage Objects**: Complete file tracking system

## Key Patterns & Best Practices

### Component Architecture
- **3-Tier Structure**: Clear separation between public, member, and admin interfaces
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Internationalization**: Complete FR/EN support throughout
- **Role-Based Rendering**: Components adapt based on user permissions

### State Management
- **Server State**: Prisma + Next.js API routes
- **Client State**: React Context for global state
- **Form Handling**: React Hook Form + Zod validation
- **Real-time Features**: Email notifications and activity tracking

### Security
- **Role-Based Access**: Granular permission system
- **Admin Validation**: All sensitive operations require approval
- **Email Verification**: Account activation workflow
- **Secure Uploads**: Presigned URL system for file handling

This documentation serves as the complete reference for the ISEP Bands project, encompassing all planned features, administrative capabilities, and technical implementation details.