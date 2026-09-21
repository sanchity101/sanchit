import os
from bs4 import BeautifulSoup

dir_path = r'C:\Users\vigne\Downloads\CTIS project\cloudvault_app'
files = [f for f in os.listdir(dir_path) if f.endswith('.html')]

# Mapping of text content or keywords to target HTML files
nav_mapping = {
    'Dashboard': 'dashboard.html',
    'My Files': 'my_files.html',
    'Upload': 'upload.html',
    'Profile': 'profile.html',
    'Settings': 'settings.html',
    'Log out': 'login.html',
    'Login': 'login.html',
    'Create Account': 'register.html',
    'Sign In': 'login.html',
    'Sign Up': 'register.html',
    'Get Started': 'register.html'
}

icon_mapping = {
    'dashboard': 'dashboard.html',
    'folder': 'my_files.html',
    'cloud_upload': 'upload.html',
    'person': 'profile.html',
    'settings': 'settings.html',
    'logout': 'login.html'
}

for filename in files:
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    modified = False

    # Find all anchor tags
    for a in soup.find_all('a'):
        href = a.get('href')
        if href == '#' or href == '' or not href:
            # Check text content
            text = a.get_text(strip=True)
            matched = False
            for key, target in nav_mapping.items():
                if key.lower() in text.lower():
                    a['href'] = target
                    modified = True
                    matched = True
                    break
            
            # If text didn't match, check icons inside the anchor
            if not matched:
                icons = a.find_all(class_='material-symbols-outlined')
                for icon in icons:
                    icon_text = icon.get_text(strip=True)
                    if icon_text in icon_mapping:
                        a['href'] = icon_mapping[icon_text]
                        modified = True
                        matched = True
                        break
                        
            # Specific case for login/register from forms (action target instead of href)
            # Actually, buttons don't have hrefs, forms have actions.
            
    # Find all forms
    for form in soup.find_all('form'):
        action = form.get('action')
        if action == '#' or action == '' or not action:
            # Guess the action based on the filename
            if filename == 'login.html':
                form['action'] = 'dashboard.html'
                modified = True
            elif filename == 'register.html':
                form['action'] = 'dashboard.html'
                modified = True
            elif filename == 'upload.html':
                form['action'] = 'my_files.html'
                modified = True
            elif filename == 'settings.html' or filename == 'profile.html':
                form['action'] = filename
                modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
            print(f"Updated links in {filename}")

print("Stitching complete.")
