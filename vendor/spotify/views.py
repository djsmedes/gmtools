import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['post'])
def spotify_auth(request, *args, **kwargs):
    vague_error_reponse_data = {"detail": "Spotify authorization could not be completed."}

    code = request.data.get("code")
    redirect_uri = request.data.get("redirect_uri")
    refresh_token = request.data.get("refresh_token")

    request_body = {
        "client_id": "4c7dbd05cc7548beb32c02c5ba65994e",  # todo - put this in an env var
        "client_secret": "e3acf88a37b843438c7ee5d0789cf00e",  # todo - put this in an env var and rotate
    }

    if refresh_token is not None:
        request_body.update({
            "grant_type": "refresh_token",
            "refresh_token": refresh_token
        })
    elif all([code, redirect_uri]):
        request_body.update({
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
        })
    else:
        return Response(vague_error_reponse_data, status=400)

    spotify_response = requests.post(
        "https://accounts.spotify.com/api/token",
        request_body
    )
    if not (200 <= spotify_response.status_code < 400):
        return Response(vague_error_reponse_data, status=500)

    try:
        spotify_response_data = spotify_response.json()
    except ValueError:
        return Response(vague_error_reponse_data, status=500)

    return Response(spotify_response_data)
