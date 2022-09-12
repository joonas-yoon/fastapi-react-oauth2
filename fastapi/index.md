# 가상 환경 세팅

```
virtualenv .venv
```

- Python 3.8.3
- pip 22.2.2

**Windows**
```
source .venv/Scripts/activate
```

**Linux/Mac**
```
source .venv/bin/activate
```

# FastAPI 모듈 설치

```
pip install fastapi uvicorn
```

# 웹 서버 애플리케이션 실행

```
uvicorn main:app --reload
```

전역에 `uvicorn`이 설치되어 있는 경우에는 아래가 확실함

```
python -m uvicorn main:app --reload
```

# 생성된 API 문서 확인

Interactive Docs (Swagger UI) - http://127.0.0.1:8000/docs

테스트할 때는 직접 API call도 할 수 있는 interactive docs가 좋다고 생각한다.


# FastAPI-users 설치

```
pip install fastapi-users[beanie]
```

# env 파일 읽도록 설정

```
pip install pydantic[dotenv]
```
