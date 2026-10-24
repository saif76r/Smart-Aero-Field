# Software Requirements Specification (SRS)

**System Name:** KrishiGuide (Smart Aero Field) — NASA Farm Navigators Edition  
**Theme:** NASA Space Apps Challenge — "NASA Farm Navigators"  
**Target Region:** Global Architecture (Pilot & Field Validation: Bangladesh)  
**Version:** 1.0 (Production Release)  
**Date:** October 2026  

---

## Table of Contents
1. [Introduction](#1-introduction)  
   1.1 [Problem Statement](#11-problem-statement)  
   1.2 [Proposed Solution](#12-proposed-solution)  
   1.3 [Scope and Global Applicability](#13-scope-and-global-applicability)  
2. [Overall Description](#2-overall-description)  
   2.1 [Product Perspective](#21-product-perspective)  
   2.2 [Product Features](#22-product-features)  
   2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)  
   2.4 [Operating Environment](#24-operating-environment)  
   2.5 [Design and Implementation Constraints (Tech Stack)](#25-design-and-implementation-constraints-tech-stack)  
   2.6 [User Documentation](#26-user-documentation)  
   2.7 [Assumptions and Dependencies](#27-assumptions-and-dependencies)  
3. [Specific Requirements](#3-specific-requirements)  
   3.1 [Functional Requirements (FR001 – FR007)](#31-functional-requirements)  
   3.2 [Non-Functional Requirements](#32-non-functional-requirements)  
4. [Feasibility Study](#4-feasibility-study)  
   4.1 [Technical Feasibility](#41-technical-feasibility)  
   4.2 [Human Resource Feasibility](#42-human-resource-feasibility)  
   4.3 [Economic Feasibility](#43-economic-feasibility)  
   4.4 [Operational Feasibility](#44-operational-feasibility)  
   4.5 [Legal and Social Feasibility](#45-legal-and-social-feasibility)  
5. [Requirements Elicitation](#5-requirements-elicitation)  
   5.1 [Techniques Used](#51-techniques-used)  
   5.2 [Application of Techniques](#52-application-of-techniques)  
6. [User Profile](#6-user-profile)  
7. [Use Case Modeling](#7-use-case-modeling)  
   7.1 [Use Case Overview](#71-use-case-overview)  
   7.2 [Detailed Use Cases](#72-detailed-use-cases)  
8. [Requirement Prioritization (MoSCoW)](#8-requirement-prioritization-moscow)  
9. [Detailed Software Requirements Specification](#9-detailed-software-requirements-specification)  
10. [Traceability Matrix](#10-traceability-matrix)  
11. [Prototype Design & Architecture](#11-prototype-design--architecture)  
12. [Conclusion & Future Roadmap](#12-conclusion--future-roadmap)  

---

## 1. Introduction

### 1.1 Problem Statement
Smallholder farmers across South Asia (particularly Bangladesh) face recurrent crop yield losses exceeding 25–40% annually due to:
- **Delayed Pest & Disease Diagnosis:** Limited access to professional agricultural extension officers leads to uncontrolled fungal and bacterial outbreaks (e.g., Rice Blast, Bacterial Leaf Blight, Sheath Rot).
- **Irrigation Inefficiency & Guesswork:** Farmers lack real-time soil moisture and precipitation telemetry, leading to over-pumping of underground aquifers or drought-induced crop failure.
- **Inaccessibility of Earth Observation Data:** NASA's multi-million dollar satellite observation datasets (such as SMAP, GPM, and NASA POWER) exist in complex scientific formats that smallholder farmers cannot readily interpret or apply to their individual 0.5–2 acre plots.
- **Climate Vulnerability:** Sudden torrential rains, flash floods, and prolonged heatwaves strike without localized, actionable early warnings.

### 1.2 Proposed Solution
**KrishiGuide (Smart Aero Field)** is a mobile-first, cloud-integrated agro-climatology and crop advisory web application. It bridges the gap between raw NASA Earth observation satellite feeds and grassroots farmers by uniting:
1. **On-Device & Cloud AI Vision Leaf Diagnosis:** Instant disease detection from camera photos, confidence ratings, and integrated chemical/organic management plans.
2. **NASA Farm Intelligence Telemetry:** Hyper-local, GPS-grounded retrieval of NASA POWER (temperature, solar radiation, humidity), NASA SMAP (soil moisture levels), and NASA GPM (precipitation & rain forecast).
3. **Combined Decision Support Engine:** Merges disease vulnerability with upcoming weather events (e.g., advising against pesticide spraying before forecasted heavy rains, or triggering Alternate Wetting & Drying [AWD] irrigation when soil moisture drops).
4. **Bilingual AI Agronomist Assistant:** Real-time conversational AI in Bangla and English for conversational field consultations.

### 1.3 Scope and Global Applicability
- **Global Architecture:** The system uses latitude/longitude coordinate indexing compatible with any farm on Earth covered by NASA's global orbital datasets.
- **Initial Pilot Region (Bangladesh):** Selected for high agricultural density, diverse microclimates, vulnerable deltaic hydrology, and high smartphone penetration among smallholder farmers.
- **Location-Agnostic Core:** Expandable to East Africa, Southeast Asia, and Latin America without architectural changes.

---

## 2. Overall Description

### 2.1 Product Perspective
KrishiGuide operates as a standalone, zero-friction farmer-facing digital platform. It does not require intermediary extension brokers for day-to-day decisions. The platform interfaces with:
- **NASA POWER REST API:** Real-time agro-meteorological metrics.
- **NASA SMAP & GPM Satellite Feeds:** Surface soil moisture and precipitation measurements.
- **Gemini Vision & Neural Inference Engine:** Image processing for crop pathology.
- **Firebase Firestore & Authentication:** Secure, offline-capable database persistence.

### 2.2 Product Features
- **Farmer Profile & Plot Registration:** Simple mobile/PIN-based login capturing crop type, land acreage, and Upazila/District coordinates.
- **AI Leaf Doctor (Disease Detection):** Camera-driven visual leaf scanning with confidence thresholding.
- **Live NASA Farm Intelligence Dashboard:** Soil moisture gauge, 7-day precipitation chart, and climate stress meters.
- **AWD (Alternate Wetting and Drying) Water Calculator:** Tailored water-saving irrigation schedules.
- **Combined Action Plans:** Unified advisories synthesizing pathology status with 48-hour weather outlooks.
- **Interactive AI Agronomist:** 24/7 bilingual chatbot equipped with local agronomic active ingredients and dosage rates.

### 2.3 User Classes and Characteristics
| User Class | Description | Skill Level & Access |
| :--- | :--- | :--- |
| **Smallholder Farmer** | Primary operator managing 0.5–5 acres of land. | Basic smartphone navigation; prefers Bengali audio/visual icons over complex technical jargon. |
| **Agricultural Extension Worker** | Field consultant assisting farming clusters. | Intermediate technical literacy; uses regional trend dashboards and multi-plot analytics. |

### 2.4 Operating Environment
- **Client Runtime:** Modern web browsers (Chrome, Edge, Safari, Firefox) on Android 8.0+, iOS, or Desktop.
- **Network Resilience:** Fully operational on 3G/4G networks; caches NASA satellite metrics locally to withstand intermittent rural network dropouts.
- **Serverless Backend:** Node.js/TypeScript running on Vercel Serverless Functions and Google Cloud Run.

### 2.5 Design and Implementation Constraints (Tech Stack)
| Layer | Technologies / APIs |
| :--- | :--- |
| **Frontend Framework** | React 18 with TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend / API Engine** | Node.js Express server (`server.ts`) + Vercel Serverless Functions (`api/`) |
| **Database & Cloud Storage** | Firebase Firestore (Real-time NoSQL) + Firebase Authentication |
| **NASA Satellite Datasets** | NASA POWER Agroclimatology API, NASA SMAP (Soil Moisture Active Passive), NASA GPM IMERG (Precipitation), MODIS/VIIRS NDVI |
| **AI / Machine Learning** | Google GenAI SDK (Gemini 2.5 Flash / Gemini Vision) for multilingual reasoning and image diagnostics |
| **Mapping & Geocoding** | Leaflet / OpenStreetMap GPS coordinate mapping |

### 2.6 User Documentation
- Icon-centric, visual onboarding flow.
- Bilingual tooltips and contextual voice assistance for low-literacy users.

### 2.7 Assumptions and Dependencies
- The device has an accessible camera or photo upload capability.
- Public NASA APIs maintain standard uptime and open-access data redistribution policies.
- User GPS or district selections reflect true field geography within 10 km grid accuracy.

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### FR001: User Registration and Login
- **Description:** Farmers shall register and authenticate securely using their Mobile Number and a 4–6 digit PIN or Password.
- **Inputs:** Farmer Name, Mobile Number, PIN, District/Upazila, Land Acreage, Primary Crop.
- **Outputs:** Authenticated user session, profile synchronization with Firestore.

#### FR002: AI Crop Disease Detection
- **Description:** Farmers shall capture or upload an image of an affected leaf. The AI model analyzes the pathology and outputs the disease name, confidence score, symptoms, and treatment.
- **Exception Flow:** If confidence is below 70%, the system informs the farmer to retake the photo with better lighting or focus rather than returning inaccurate advice.

#### FR003: NASA Farm Intelligence Retrieval
- **Description:** The system automatically queries NASA satellite endpoints for the farm's coordinates to retrieve:
  - Surface Soil Moisture ($m^3/m^3$)
  - Ambient Temperature & Relative Humidity
  - Precipitation & 7-Day Rainfall Accumulation (mm)
  - Solar Insolation & Weather Trends

#### FR004: Combined Action Plan Generation
- **Description:** The core rules engine merges leaf diagnostic findings with NASA climate forecasts.
- **Example Scenario:** If Leaf Blast is detected, but NASA GPM forecasts heavy rain in 6 hours, the action plan advises: *"Do not spray fungicide today as rainfall will wash away active ingredients. Drain standing water to reduce fungal humidity and apply Tricyclazole immediately after rainfall clears."*

#### FR005: Plot & History Management
- **Description:** Farmers can track their crop cycle history, past disease diagnosis scans, and previous weather trend records over the entire growing season.

#### FR006: Alerts & Notifications
- **Description:** Generates high-priority warning cards for drought threshold breaches, flash flood risks, or severe pest/fungal-conducive weather conditions.

#### FR007: Multilingual Support
- **Description:** Seamless toggle between English and Bengali (বাংলা) across all screens, charts, advisories, and chatbot conversations.

### 3.2 Non-Functional Requirements
- **Performance:** NASA telemetry dashboard loads in $<3$ seconds (cached); AI leaf diagnosis completes within $<5$ seconds.
- **Security:** Industry-standard SSL/TLS encryption in transit; Firebase Firestore security rules ensuring farmer privacy.
- **Usability:** High-contrast touch targets, intuitive agricultural iconography, zero clutter.
- **Availability:** 99.5% service uptime with offline local caching for recent satellite readings.

---

## 4. Feasibility Study

### 4.1 Technical Feasibility
- **Data Availability:** NASA POWER and Earthdata provide open, keyless/authenticated public REST APIs with historical and near-real-time global coverage.
- **AI Processing:** Serverless execution and lightweight client pipelines eliminate the need for heavy local GPU processing on low-cost Android smartphones.

### 4.2 Human Resource Feasibility
- Requires full-stack engineers experienced in React/TypeScript, ML integration, and agronomic domain specialists from national bodies (e.g., DAE, BRRI, BARC) for rule validation.

### 4.3 Economic Feasibility
- **Low Capital Expenditure:** NASA Earth data is freely accessible.
- **High Return on Investment (ROI):** Mitigating a single crop disease outbreak or avoiding unnecessary irrigation cycles can save a farmer ৳10,000–৳25,000 per acre per season.

### 4.4 Operational Feasibility
- Adaptable to agricultural extension programs, NGO rural development initiatives, and local farmer cooperatives across Bangladesh.

### 4.5 Legal and Social Feasibility
- Full adherence to NASA Open Data Policy terms. Complies with international and local digital privacy principles.

---

## 5. Requirements Elicitation
- **Interviews:** Consultations with rural farmers regarding pesticide usage, water pumping expenses, and blast disease losses.
- **Questionnaires:** Gathered feedback on interface complexity, color schemes, and preferred language.
- **Document Analysis:** Comprehensive study of NASA Space Apps Challenge "NASA Farm Navigators" problem statements and DAE agro-advisory handbooks.

---

## 6. User Profile (Persona: Md. Rafiqul Islam)
- **Age:** 44 | **Location:** Bagerhat, Khulna Division, Bangladesh
- **Landholding:** 1.8 Acres | **Primary Crop:** Aman Rice (BRRI Dhan 49)
- **Pain Points:** Frequent saline intrusion, sudden late-season downpours, blast attacks, diesel fuel costs for irrigation pumps.
- **Technical Competency:** Uses smartphone for voice calls, YouTube, and WhatsApp; needs clear icons and Bangla instructions.

---

## 7. Use Case Modeling

```
+--------------------------------------------------------------+
|                     KrishiGuide System                       |
|                                                              |
|   +-------------------+                                      |
|   |   Register/Login  | <----------------- Farmer            |
|   +-------------------+                      |               |
|             |                                |               |
|   +-------------------+                      |               |
|   | Detect Disease    | <--------------------+               |
|   +-------------------+                      |               |
|             ^                                |               |
|             | (Inference)                    |               |
|   +-------------------+                      |               |
|   | AI Vision Model   |                      |               |
|   +-------------------+                      |               |
|                                              |               |
|   +-------------------+                      |               |
|   | Fetch NASA Data   | <--------------------+               |
|   +-------------------+                      |               |
|             ^                                |               |
|             | (Satellite Telemetry)          |               |
|   +-------------------+                      |               |
|   | NASA POWER / SMAP |                      |               |
|   +-------------------+                      |               |
|             |                                |               |
|   +-------------------+                      |               |
|   | Action Plan Gen   | -------------------> | (Action Plan) |
|   +-------------------+                                      |
+--------------------------------------------------------------+
```

### Detailed Use Case: Generate Combined Action Plan
1. Farmer navigates to the Advisory screen or completes a Leaf Diagnosis.
2. System queries NASA GPM & POWER for current precipitation probability and temperature.
3. System correlates leaf pathogen data with weather conditions.
4. If conditions promote pathogen spread (humidity $>85\%$ and temperature $26^\circ\text{C}-30^\circ\text{C}$), an urgent warning badge is generated.
5. The combined advisory is rendered in Bangla with concrete dosage schedules.

---

## 8. Requirement Prioritization (MoSCoW)

| Priority Level | Requirement Identifiers | Description |
| :--- | :--- | :--- |
| **Must Have** | FR001, FR002, FR003, FR004 | Authentication, AI Diagnosis, NASA Telemetry, Combined Action Plan |
| **Should Have** | FR005, FR006, FR007 | Plot History, Climate Risk Alerts, Full Bengali/English Localization |
| **Could Have** | AWD Water Calculator, AI Chatbot | Automated AWD depth guidance, Conversational AI Agronomist |
| **Won't Have (v1)** | Drone autonomous spraying | Physical hardware automated robotics integration |

---

## 9. Traceability Matrix

| Req ID | Requirement Description | Test Case ID | Test Scenario & Verification | Status |
| :---: | :--- | :---: | :--- | :---: |
| **FR001** | User Registration & Login | TC001 / TC002 | Validates phone/PIN entry and state persistence | **PASS** |
| **FR002** | AI Crop Disease Detection | TC003 / TC004 | Uploads infected leaf; verifies disease name & confidence | **PASS** |
| **FR003** | NASA Farm Intelligence | TC005 / TC006 | Retrieves NASA POWER & SMAP soil data for coordinates | **PASS** |
| **FR004** | Combined Action Plan | TC007 | Merges low soil moisture with rain outlook for irrigation advice | **PASS** |
| **FR005** | Plot & History Tracking | TC008 | Stores and recalls past disease scans across sessions | **PASS** |
| **FR006** | Climate Alerts & Warnings | TC009 | Verifies alert triggers when drought/heat thresholds breach | **PASS** |
| **FR007** | Multilingual Support | TC010 | Toggles between Bengali and English across all UI views | **PASS** |

---

## 10. Prototype Screens

1. **Authentication Screen:** Mobile Number, PIN, Land Size, District, and Crop selection.
2. **Dashboard Overview:** Live GPS coordinates, current temperature, relative humidity, and 7-day NASA precipitation trend graph.
3. **AI Leaf Doctor Modal:** File upload & real-time camera capture with immediate diagnostic readout and treatment plans.
4. **NASA Climate & Soil Moisture Card:** Simplified Low/Moderate/High status meters alongside technical metric readouts.
5. **Combined Action Plan & AWD Panel:** Practical instructions guiding fertilizer application, spraying windows, and water levels.
6. **AI Agronomist Chatbot Drawer:** Persistent voice/text conversational assistant.

---

## 11. Conclusion & Future Roadmap

**KrishiGuide (Smart Aero Field)** transforms complex, global NASA Earth observation satellite data into accessible, field-level decisions for smallholder farmers. By eliminating guesswork in disease identification and irrigation scheduling, the platform protects crop yields, saves precious water resources, and fosters resilient agricultural communities.

Future phases will incorporate expanded regional language audio synthesizer engines, hyper-local community disease outbreak heatmaps, and automated soil sensor IoT telemetry integrations.
