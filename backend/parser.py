# backend/parser.py
import pdfplumber
import docx

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print("PDF parsing error:", e)
    return text

def extract_text_from_docx(docx_path):
    text = ""
    try:
        doc = docx.Document(docx_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print("DOCX parsing error:", e)
    return text

# backend/parser.py

def extract_fields(text):
    lines = text.splitlines()
    lines = [line.strip() for line in lines if line.strip()]

    result = {
        "name": None,
        "email": None,
        "phone": None,
        "skills": [],
        "education": [],
        "experience": []
    }

    # === Basic Fields ===
    import re
    email_match = re.search(r'[\w\.-]+@[\w\.-]+', text)
    phone_match = re.search(r'\+?\d[\d\s\-]{8,}', text)
    name_guess = lines[0] if len(lines[0].split()) <= 5 else None

    result["email"] = email_match.group() if email_match else None
    result["phone"] = phone_match.group() if phone_match else None
    result["name"] = name_guess

    # === Skills Detection ===
    known_skills = [
        'python', 'java', 'c', 'c++', 'javascript', 'react', 'sql',
        'git', 'django', 'flask', 'html', 'css', 'aws', 'opencv', 'machine learning'
    ]
    for skill in known_skills:
        if skill.lower() in text.lower():
            result["skills"].append(skill)

    # === Education Section ===
    for line in lines:
        if any(kw in line.lower() for kw in ['b.tech', 'bachelor', 'master', 'university', 'cgpa']):
            result["education"].append(line)

    # === Experience Section ===
    for i, line in enumerate(lines):
        if any(kw in line.lower() for kw in ['intern', 'experience', 'developer', 'project']):
            result["experience"].append(line)

    return result
