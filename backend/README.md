# automeals - backend

## Installation

I recommend using [uv](https://docs.astral.sh/uv/) to manage the python version, virtual environment and `automeals` backend installation:

```bash
uv venv --python 3.13
source .venv/bin/activate
uv pip install .
```

## Usage

```bash
uvicorn app.main:app --reload
```