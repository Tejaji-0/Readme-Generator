import os


repo_base_path = None

def set_repo_path(path):
    global repo_base_path
    repo_base_path = path


# Step 1: List all files in the cloned repo (recursively)
def get_file_tree():
    file_tree = []
    for dirpath, _, filenames in os.walk(repo_base_path):
        for filename in filenames:
            full_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(full_path, repo_base_path) 
            file_tree.append(rel_path)
    '''
    ✅ What it does:
        Converts the full absolute file path to a relative path from temp/.
        For example:
        If the file is at temp/src/index.js, rel_path becomes src/index.js.
        Then appends it to file_tree.
    '''

    return file_tree

# Step 2: Read content of a file, safely
def read_file(path):

    '''
    ✅ What it does:
    upr wale function ne jo her file k aage se /temp hataya tha aur file ka naam save kiya tha jo imp lagi 
    to ab ye vala function pehle vaps /temp lgayega taaki files read ho sake
    '''
    full_path = os.path.join(repo_base_path, path)

    try:
        with open(full_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading {path}: {e}"