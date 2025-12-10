# FITMIT_client

## 🤝 협업 규칙

이 레포지토리는 **브랜치를 나누지 않고 `main` 브랜치에 직접 작업을 반영**합니다.
협업 효율을 위해 아래 규칙을 꼭 지켜주세요.

---

## 1️⃣ 코드 컨벤션 (Code Convention)

### 공통 규칙

* (팀에서 확정 후 작성)

---

## 2️⃣ Git 사용 규칙

> 브랜치를 사용하지 않기 때문에, **반드시 아래 순서 준수!**

### 🔹 포크하는 법

1. Fork할 레파지토리에서 new Fork 생성하여 본인 레파지토리로 이관
2. STS에 git clone 후
   
   ```bash
   git remote add master {상위 레파지토리}
   git remote add origin {본인 레파지토리}
   ```

### 🔹 작업 전

1. 최신 Master 코드 가져오기

   ```bash
   git pull master main
   ```

### 🔹 작업 후

1. 변경 사항 확인

   ```bash
   git status
   git diff
   ```

2. 충돌 방지 — 변경 된 코드 Stash

   ```bash
   git stash push -m "message"
   git stash save "message"
   git stash
   ```
   => 셋 중 선택 자유

   ```bash
   git stash list
   ```
   => stash 목록 확인

3. 충돌 방지 — 최신 코드 Pull

   ```bash
   git pull master main
   ```

4. 충돌 방지 — Stash 해놓은 내 변경사항 다시 반영

   ```bash
   git stash apply stash@{index}
   ```
   => 만약 Merge 해야할 상황있다면 Merge 후 Pull Request 시 메시지 남겨놓기

5. 필요한 파일만 스테이징

   ```bash
   git add <파일명>
   # 정말 확실한 경우에만
   git add .
   ```

6. 의미 있는 커밋 메시지 작성

   ```bash
   git commit -m "[feat] 회원가입 API 구현"
   git commit -m "[fix] 로그인 예외 처리 수정"
   git commit -m "[docs] README 업데이트"
   ```

7. 이상 없으면 Push

   ```bash
   git push origin main
   ```

8. Origin에 Push 된 변경 사항 Master로 Pull Request
   

> ⚠️ **main이 배포 기준 브랜치입니다.**
> 빌드/실행 안 되는 코드는 절대 올리지 말아주세요 🙏

---

## Project Setup
clone받고 꼭 한번 실행해주기!

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

---

### 프로젝트 파일 구성 요소

```
📦 FIT-MEET-CLIENT
├─ 📁 src
│  ├─ 📁 assets
│  ├─ 📁 components
│  │  ├─ 📁 auth     => auth 관련 폼 컴포넌트 폴더 
│  │  │  ├─ LoginForm.vue   => 로그인 폼
│  │  │  ├─ SignupForm.vue  => 회원가입 폼
│  │  │  └─ UserInfoSettingForm.vue  => 마이페이지 회원정보 폼(예정)
│  │  ├─ 📁 common   => 공통 사용되는 컴포넌트 모음 폴더
│  │  │  ├─ 📁 unused   => 현재 미사용되는 소스파일 저장(추후 완성후 여전히 미사용시 폴더 전체 삭제 예정)
│  │  │  ├─ Footer.vue  
│  │  │  ├─ Header.vue 
│  │  │  ├─ MobileSliderbar.vue  => 모바일 화면의 사이드바 
│  │  │  ├─ NumberPicker.vue   => 신체정보 입력의 수치 슬라이드
│  │  │  └─ UserDropdown.vue   => 모바일화면의 마이페이지 진입 드롭다운
│  │  └─ 📁 userInfo
│  │     └─ 📁 health  => 신체정보 관련 컴포넌트 모음
│  │        ├─ ProgressBar.vue  => 정보입력의 진행상태 바
│  │        ├─ StepActivityLevel.vue  => 운동 정도 입력 폼 
│  │        ├─ StepGenderBirth.vue    => 성별 및 생년월일 선택 바
│  │        ├─ StepHeight.vue         => 현재 키 폼
│  │        ├─ StepTargetWeight.vue   => 목표 체중 폼
│  │        └─ StepWeight.vue         => 현재 체중 폼
│  │
│  ├─ 📁 layouts
│  │  └─ AuthLayout.vue  => Login과 Signup에 필요한 레이아웃(나중에 수정할수도..?)
│  ├─ 📁 pages    => 각 페이지의 제일 바깥 컨테이너 페이지(submit 위치함)
│  │  ├─ HomePage.vue
│  │  ├─ LoginPage.vue
│  │  ├─ PasswordResetPage.vue    => 비밀번호 재설정 폼
│  │  ├─ SignupPage.vue
│  │  ├─ UserHealthInfoPage.vue   => 신체정보 입력 폼
│  │  └─ UserInfoSettingPage.vue
│  ├─ 📁 router
│  │  └─ index.js  => 라우터 파일
│  ├─ 📁 stores
│  │  ├─ Auth.js   => auth관련 상태관리(로그인 전역관리 포함)
│  │  └─ User.js   => user관련 상태관리 
│  ├─ App.vue
│  ├─ main.js
│  └─ tailwind.css
├─ .gitignore
├─ index.html
└─ package.json
```


