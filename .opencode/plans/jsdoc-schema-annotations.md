# Execution Plan: Add JSDoc Swagger Schemas to Model Files

## Goal
Add `@swagger` JSDoc annotations to all Mongoose model files so `swagger-jsdoc` (used by `/swagger.json` and `/api-docs`) picks up the schemas automatically.

## Context
- `src/docs/swagger.ts` configures `swagger-jsdoc` with `apis: ["./src/**/*.ts"]`
- The `/swagger.json` route sends the in-memory `swaggerSpec` from `swagger-jsdoc`
- `/api-docs` loads from `/swagger.json` dynamically
- None of the model files currently have JSDoc swagger annotations
- `public/swagger.json` (tsoa-generated) already has schemas, but is not served by `/api-docs`

## Files to Edit (12 total)

### 1. `src/auth/model/auth.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64c0a1b2c3d4e5f6a7b8c9d0
 *         firstName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           nullable: true
 *         password:
 *           type: string
 *           nullable: true
 *         role:
 *           $ref: '#/components/schemas/EUserRole'
 *         isVerified:
 *           type: boolean
 *           default: false
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 2. `src/auth/model/onboarding.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Onboarding:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *           description: ObjectId ref to Auth
 *         userId:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         studentClass:
 *           type: string
 *           nullable: true
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           nullable: true
 *         stateOfOrigin:
 *           type: string
 *           nullable: true
 *         residentialAddress:
 *           type: string
 *           nullable: true
 *         town:
 *           type: string
 *           nullable: true
 *         state:
 *           type: string
 *           nullable: true
 *         schoolName:
 *           type: string
 *           nullable: true
 *         schoolAddress:
 *           type: string
 *           nullable: true
 *         learningProfile:
 *           type: object
 *           properties:
 *             learningStyle:
 *               type: string
 *               enum: [visual, auditory, reading, kinesthetic]
 *               nullable: true
 *             confidence:
 *               type: number
 *               nullable: true
 *             cognitiveScore:
 *               type: number
 *               nullable: true
 *             recommendedFormats:
 *               type: array
 *               items:
 *                 type: string
 *             explanation:
 *               type: string
 *               nullable: true
 *             risk_of_misclassification:
 *               type: string
 *               enum: [low, medium, high]
 *               nullable: true
 *             lastUpdated:
 *               type: string
 *               format: date-time
 *               nullable: true
 *         pastExam:
 *           type: object
 *           properties:
 *             firstTerm:
 *               type: string
 *               nullable: true
 *             secondTerm:
 *               type: string
 *               nullable: true
 *             thirdTerm:
 *               type: string
 *               nullable: true
 *         photo:
 *           type: string
 *           nullable: true
 *         language:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 3. `src/auth/model/otp.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Otp:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *           nullable: true
 *         otp:
 *           type: string
 *           nullable: true
 *         otpExpiresIn:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 4. `src/auth/model/status.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Status:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         todayGoal:
 *           type: string
 *           nullable: true
 *         subJectsInProgress:
 *           type: number
 *           default: 0
 *         assessmentTaken:
 *           type: number
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 5. `src/assessment/models/assessment.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Assessment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *           description: ObjectId ref to User
 *         subject:
 *           type: string
 *           description: ObjectId ref to Subject
 *         class:
 *           type: string
 *           example: jss2
 *         type:
 *           type: string
 *           enum: [initial, general, category, topic]
 *         topicInstances:
 *           type: array
 *           items:
 *             type: string
 *           description: ObjectId[] ref to TopicInstance
 *         questions:
 *           type: array
 *           items:
 *             type: string
 *           description: ObjectId[] ref to AssessmentQuestion
 *         totalQuestions:
 *           type: number
 *           minimum: 1
 *         status:
 *           type: string
 *           enum: [in-progress, completed, abandoned]
 *           default: in-progress
 *         startedAt:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         duration:
 *           type: number
 *           nullable: true
 *           description: Seconds elapsed
 *         score:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           nullable: true
 *         submittedAnswers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *               selected:
 *                 type: string
 *               isCorrect:
 *                 type: boolean
 *                 nullable: true
 *         result:
 *           type: object
 *           properties:
 *             attempted:
 *               type: number
 *             correct:
 *               type: number
 *             wrong:
 *               type: number
 *             unanswered:
 *               type: number
 *             topicPerformance:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   topicInstanceId:
 *                     type: string
 *                   accuracy:
 *                     type: number
 *                   total:
 *                     type: number
 *                   correct:
 *                     type: number
 *                   wrong:
 *                     type: number
 *             weakTopics:
 *               type: array
 *               items:
 *                 type: string
 *             strongTopics:
 *               type: array
 *               items:
 *                 type: string
 *         aiContent:
 *           type: array
 *           items:
 *             type: object
 *           nullable: true
 *         meta:
 *           type: object
 *           properties:
 *             source:
 *               type: string
 *               enum: [system, user, recommendation]
 *               default: system
 *             difficultyMix:
 *               type: object
 *               properties:
 *                 easy:
 *                   type: number
 *                   minimum: 0
 *                   default: 0
 *                 medium:
 *                   type: number
 *                   minimum: 0
 *                   default: 0
 *                 hard:
 *                   type: number
 *                   minimum: 0
 *                   default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 6. `src/assessment/models/assessmentQuestion.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     AssessmentQuestion:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         questionNumber:
 *           type: string
 *           example: ENG001
 *         subject:
 *           type: string
 *           description: ObjectId ref to Subject
 *         class:
 *           type: string
 *           example: jss2
 *         topicInstanceId:
 *           type: string
 *           description: ObjectId ref to TopicInstance
 *         question:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               text:
 *                 type: string
 *         answer:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *         category:
 *           type: string
 *           enum: [grammar, comprehension, vocabulary, oral, writing]
 *         explanation:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 7. `src/assessment/models/recommendedContent.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     RecommendedContent:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         assessmentId:
 *           type: string
 *         subject:
 *           type: string
 *         topic:
 *           type: string
 *         category:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         type:
 *           type: string
 *           enum: [video, audio, text, interactive]
 *         url:
 *           type: string
 *           nullable: true
 *         coverImage:
 *           type: string
 *           nullable: true
 *         source:
 *           type: string
 *           enum: [ai, manual]
 *           default: ai
 *         priority:
 *           type: number
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 8. `src/assessment/models/subject.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: english
 *         code:
 *           type: string
 *           example: ENG
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 9. `src/assessment/models/topic.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Topic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: grammar
 *         subject:
 *           type: string
 *           description: ObjectId ref to Subject
 *         slug:
 *           type: string
 *           example: english-grammar
 *         description:
 *           type: string
 *           nullable: true
 *         category:
 *           type: string
 *           example: grammar
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 10. `src/assessment/models/topicInstance.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     TopicInstance:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         topic:
 *           type: string
 *           description: ObjectId ref to Topic
 *         subject:
 *           type: string
 *           description: ObjectId ref to Subject
 *         class:
 *           type: string
 *           example: jss2
 *         difficultyLevel:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         order:
 *           type: number
 *         estimatedDuration:
 *           type: number
 *           nullable: true
 *         isCore:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 11. `src/assessment/models/userTopicMastery.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     UserTopicMastery:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         topicInstanceId:
 *           type: string
 *         masteryScore:
 *           type: number
 *           default: 50
 *           minimum: 0
 *           maximum: 100
 *         attempts:
 *           type: number
 *           default: 0
 *         lastAccuracy:
 *           type: number
 *           nullable: true
 *         weakStreak:
 *           type: number
 *           default: 0
 *         strongStreak:
 *           type: number
 *           default: 0
 *         status:
 *           type: string
 *           enum: [weak, improving, mastered]
 *           default: improving
 *         lastAssessedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

### 12. `src/questionnaire/model/question.model.ts`
Insert before line 1:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     QuestionnaireQuestion:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         questionNumber:
 *           type: string
 *         question:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               text:
 *                 type: string
 *               trait:
 *                 type: string
 *                 enum: [visual, auditory, reading, kinesthetic, neutral]
 *                 nullable: true
 *         category:
 *           type: string
 *           enum: [learning_style, cognitive]
 *         answer:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
```

## Verification Steps
1. After editing all 12 files, restart the backend server
2. Visit `http://localhost:5175/api-docs` (or the correct backend port)
3. Check the "Schemas" section at the bottom of Swagger UI
4. Alternatively, curl `/swagger.json` and verify the schema keys exist

## Note
- `AssessmentQuestionModel` was renamed to `AssessmentQuestion` to match the existing DTO name in the swagger-jsdoc output. If there's a conflict with the tsoa-generated DTO, we can rename it to `AssessmentQuestionDoc`.
- `Status` model exports as `model("Auth", ...)` in the source code (a bug), but the schema name here is `Status`.
